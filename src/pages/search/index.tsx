import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/satellite.css";
import styles from "../../styles/search.module.css";

import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { Filters } from "../../components/Filters";
import { SearchBox } from "../../components/SearchBox";
import { Hits } from "../../components/Hits";
import { useRouter } from "next/router";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { useConfiguration } from "../../lib/configuration";
import { useMemo } from "react";

function Search() {
  const { appBridgeState } = useAppBridge();
  const algoliaConfiguration = useConfiguration(appBridgeState?.domain, appBridgeState?.token);

  const searchClient = useMemo(() => {
    if (!algoliaConfiguration.data?.appId || !algoliaConfiguration.data.secretKey) {
      return null;
    }
    return algoliasearch(algoliaConfiguration.data.appId, algoliaConfiguration.data.secretKey);
  }, [algoliaConfiguration?.data?.appId, algoliaConfiguration?.data?.secretKey]);

  const router = useRouter();
  const handleClick = (val: string) => router.push("/" + val);

  // todo: Provide utils to get available index names
  const indexName = algoliaConfiguration?.data?.indexNamePrefix
    ? `${algoliaConfiguration?.data?.indexNamePrefix}.default-channel.USD.products`
    : "default-channel.USD.products";

  return (
    <>
      <PageTabs value="search" onChange={handleClick}>
        <PageTab label={"Configuration"} value="" />
        <PageTab label={"Preview"} value="search" />
      </PageTabs>
      {!!searchClient && (
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <div className={styles.grid}>
            <Filters />
            <div className={styles.contentWrapper}>
              <SearchBox />
              <Hits />
            </div>
          </div>
        </InstantSearch>
      )}
    </>
  );
}

export default Search;
