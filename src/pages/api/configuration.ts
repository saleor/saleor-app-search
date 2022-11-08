import type { NextApiRequest, NextApiResponse } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";

import { createClient } from "../../lib/graphql";
import { createSettingsManager } from "../../lib/metadata";
import { saleorApp } from "../../../saleor-app";
import { AlgoliaConfigurationFields } from "../../lib/algolia/types";

export interface SettingsApiResponse {
  success: boolean;
  data?: AlgoliaConfigurationFields;
}

const sendResponse = async (
  res: NextApiResponse<SettingsApiResponse>,
  statusCode: number,
  settings: SettingsManager,
  domain: string,
) => {
  res.status(statusCode).json({
    success: statusCode === 200,
    data: {
      secretKey: (await settings.get("secretKey", domain)) || "",
      searchKey: (await settings.get("searchKey", domain)) || "",
      appId: (await settings.get("appId", domain)) || "",
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsApiResponse>,
) {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;

  const authData = await saleorApp.apl.get(saleorDomain);

  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).json({ success: false });
    return;
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token }),
  );

  const settings = createSettingsManager(client);

  if (req.method === "GET") {
    await sendResponse(res, 200, settings, saleorDomain);
    return;
  } else if (req.method === "POST") {
    const { appId, searchKey, secretKey } = JSON.parse(req.body) as AlgoliaConfigurationFields;
    await settings.set([
      { key: "secretKey", value: secretKey || "", domain: saleorDomain },
      { key: "searchKey", value: searchKey || "", domain: saleorDomain },
      { key: "appId", value: appId || "", domain: saleorDomain },
    ]);
    await sendResponse(res, 200, settings, saleorDomain);
    return;
  }
  res.status(405).end();
  return;
}
