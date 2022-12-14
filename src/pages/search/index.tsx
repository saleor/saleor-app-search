import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  Pagination,
  Breadcrumb,
  HierarchicalMenu,
} from "react-instantsearch-hooks-web";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { RangeInput } from "react-instantsearch-hooks-web";
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/satellite.css";
import styles from "../../styles/search.module.css";

import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { SearchBox } from "../../components/SearchBox";
import { Hits } from "../../components/Hits";
import { useRouter } from "next/router";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { useConfiguration } from "../../lib/configuration";
import { useMemo, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { useQuery } from "react-query";

function Search() {
  const { appBridgeState } = useAppBridge();
  const [indexName, setIndexName] = useState<string>();
  const algoliaConfiguration = useConfiguration(appBridgeState?.domain, appBridgeState?.token);

  const searchClient = useMemo(() => {
    if (!algoliaConfiguration.data?.appId || !algoliaConfiguration.data.secretKey) {
      return null;
    }
    return algoliasearch(algoliaConfiguration.data.appId, algoliaConfiguration.data.secretKey);
  }, [algoliaConfiguration?.data?.appId, algoliaConfiguration?.data?.secretKey]);

  const router = useRouter();
  const handleClick = (val: string) => router.push("/" + val);

  const indicesQuery = useQuery({
    queryKey: ["indices"],
    queryFn: () => searchClient?.listIndices(),
    onSuccess: (data) => {
      // auto select the first fetched index to display its contents
      if (data?.items?.length) {
        setIndexName(data.items[0].name);
      }
    },
    enabled: !!searchClient,
  });

  const availableIndices = indicesQuery.data?.items.map((index) => index.name) || [];

  const displayInterface = !!searchClient && indexName;

  return (
    <>
      <PageTabs value="search" onChange={handleClick}>
        <PageTab label={"Configuration"} value="" />
        <PageTab label={"Preview"} value="search" />
      </PageTabs>

      {displayInterface ? (
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <div className={styles.grid}>
            <div className={styles.filterGrid}>
              <Card>
                <CardHeader title={"Index"} />
                <CardContent>
                  <Select
                    labelId="index-select-label"
                    id="index-select"
                    value={indexName}
                    onChange={(event) => setIndexName(event.target.value as string)}
                  >
                    {availableIndices.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title={"Categories"} />
                <CardContent>
                  <HierarchicalMenu
                    attributes={["categories.lvl0", "categories.lvl1", "categories.lvl1"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader title={"Filters"} />
                <CardContent>
                  <RangeInput attribute="grossPrice" />
                </CardContent>
              </Card>
            </div>
            <div className={styles.contentWrapper}>
              <Breadcrumb attributes={["categories.lvl0", "categories.lvl1", "categories.lvl2"]} />
              <SearchBox />
              <Hits />
              <Pagination />
            </div>
          </div>
        </InstantSearch>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default Search;
