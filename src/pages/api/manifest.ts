import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import {webhook as PRODUCT_CREATED} from './webhooks/saleor/PRODUCT_CREATED';
import {webhook as PRODUCT_DELETED} from './webhooks/saleor/PRODUCT_DELETED';
import {webhook as PRODUCT_UPDATED} from './webhooks/saleor/PRODUCT_UPDATED';
import {webhook as PRODUCT_VARIANT_CREATED} from './webhooks/saleor/PRODUCT_VARIANT_CREATED';
import {webhook as PRODUCT_VARIANT_DELETED} from './webhooks/saleor/PRODUCT_VARIANT_DELETED';
import {webhook as PRODUCT_VARIANT_UPDATED} from './webhooks/saleor/PRODUCT_VARIANT_UPDATED';

export default createManifestHandler({
  async manifestFactory(context) {
    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      permissions: [
        /**
         * Set permissions for app if needed
         * https://docs.saleor.io/docs/3.x/developer/permissions
         */
        "MANAGE_PRODUCTS",
        "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
      ],
      id: packageJson.name,
      version: packageJson.version,
      webhooks: [
        /**
         * Configure webhooks here. They will be created in Saleor during installation
         * Read more
         * https://docs.saleor.io/docs/3.x/developer/api-reference/objects/webhook
         */
         PRODUCT_CREATED.getWebhookManifest(context.appBaseUrl),
         PRODUCT_DELETED.getWebhookManifest(context.appBaseUrl),
         PRODUCT_UPDATED.getWebhookManifest(context.appBaseUrl),
         PRODUCT_VARIANT_CREATED.getWebhookManifest(context.appBaseUrl),
         PRODUCT_VARIANT_DELETED.getWebhookManifest(context.appBaseUrl),
         PRODUCT_VARIANT_UPDATED.getWebhookManifest(context.appBaseUrl),
      ],
      extensions: [
        /**
         * Optionally, extend Dashboard with custom UIs
         * https://docs.saleor.io/docs/3.x/developer/extending/apps/extending-dashboard-with-apps
         */
      ],
    };

    return manifest;
  },
});
