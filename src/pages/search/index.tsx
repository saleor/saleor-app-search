import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
} from "react-instantsearch-hooks-web";
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/satellite.css";
import styles from "./search.module.css";

import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { Filters } from "./Filters";
import { SearchBox } from "./SearchBox";
import { Hits } from "./Hits";

const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "";
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";

const searchClient = algoliasearch(appId, apiKey);

// @TODO: navigate between pages
const handleTabChange = (val: string) => undefined;

function Search() {
  return (
    <>
      <PageTabs value="preview" onChange={handleTabChange}>
        <PageTab label={"Preview"} value="preview" />
        <PageTab label={"Configuration"} value="configuration" />
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
