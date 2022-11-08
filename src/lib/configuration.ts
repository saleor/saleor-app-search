import { AlgoliaConfigurationFields } from "./algolia/types";

export const fetchConfiguration = async (domain: string) => {
  const res = await fetch("/api/configuration", {
    headers: {
      "saleor-domain": domain,
    },
  });
  const data = (await res.json()) as { data?: AlgoliaConfigurationFields };
  return data.data;
};
