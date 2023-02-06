import { Card, CardHeader } from "@material-ui/core";
import { ImportProductsToAlgolia } from "./ImportProductsToAlgolia";
import AlgoliaConfigurationCard from "./AlgoliaConfigurationCard";
import { makeStyles, PageTab, PageTabs } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import Instructions from "./Instructions";

import { AppColumnsLayout } from "./AppColumnsLayout";
import { SearchAppMainBar } from "./SearchAppMainBar";

const useStyles = makeStyles({
  buttonsGrid: { display: "flex", gap: 10 },
  topBar: {
    marginBottom: 32,
  },
  indexActions: {
    marginTop: 10,
  },
});

export const ConfigurationView = () => {
  const styles = useStyles();
  const router = useRouter();

  const handleClick = (val: string) => router.push("/" + val);
  return (
    <div>
      <SearchAppMainBar />
      <PageTabs value="" onChange={handleClick}>
        <PageTab label={"Configuration"} value="" />
        <PageTab label={"Preview"} value="search" />
      </PageTabs>
      <AppColumnsLayout>
        <div />
        <div>
          <AlgoliaConfigurationCard />
          <Card className={styles.indexActions}>
            <CardHeader title="Index actions" />
            <ImportProductsToAlgolia />
          </Card>
        </div>
        <Instructions />
      </AppColumnsLayout>
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default ConfigurationView;
