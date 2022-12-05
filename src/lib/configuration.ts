import { useQuery } from "react-query";
import { AlgoliaConfigurationFields } from "./algolia/types";

export const fetchConfiguration = async (domain: string, token: string) => {
  console.log("trying to fetch conf for", domain);
  const res = await fetch("/api/configuration", {
    headers: {
      "authorization-bearer": token,
      "saleor-domain": domain,
    },
  });
  const data = (await res.json()) as { data?: AlgoliaConfigurationFields };
  return data.data;
};

export const useConfiguration = (domain?: string | undefined, token?: string | undefined) =>
  useQuery({
    queryKey: ["configuration"],
    queryFn: () => fetchConfiguration(domain!, token!),
    enabled: !!token && !!domain,
  });
