import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/satellite.css";
import styles from "./search.module.css";

import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { Filters } from "./Filters";
import { SearchBox } from "./SearchBox";
import { Hits } from "./Hits";
import { useRouter } from "next/router";

const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "";
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";

const searchClient = algoliasearch(appId, apiKey);

function Search() {
  const router = useRouter();
  const handleClick = (val: string) => router.push("/" + val);

  return (
    <>
      <PageTabs value="search" onChange={handleClick}>
        <PageTab label={"Configuration"} value="" />
        <PageTab label={"Preview"} value="search" />
      </PageTabs>
      <InstantSearch searchClient={searchClient} indexName="default-channel.USD.products">
        <div className={styles.grid}>
          <Filters />
          <div className={styles.contentWrapper}>
            <SearchBox />
            <Hits />
          </div>
        </div>
      </InstantSearch>
    </>
  );
}

export default Search;
