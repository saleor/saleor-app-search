import { useQuery } from "react-query";
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

export const useConfiguration = (domain?: string | undefined) =>
  useQuery({
    queryKey: ["configuration"],
    queryFn: () => fetchConfiguration(domain!),
  });
