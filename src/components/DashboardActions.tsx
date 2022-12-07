import { Card, CardHeader } from "@material-ui/core";
import { ImportProductsToAlgolia } from "./ImportProductsToAlgolia";
import AlgoliaConfigurationCard from "./AlgoliaConfigurationCard";
import { Grid } from "@material-ui/core";
import { PageTab, PageTabs } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import Instructions from "./Instructions";

export const DashboardActions = () => {
  const router = useRouter();
  const handleClick = (val: string) => router.push("/" + val);
  return (
    <div>
      <PageTabs value="" onChange={handleClick}>
        <PageTab label={"Configuration"} value="" />
        <PageTab label={"Preview"} value="search" />
      </PageTabs>
      <div style={{ marginTop: "16px" }} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Instructions />
        </Grid>
        <Grid item xs={12}>
          <AlgoliaConfigurationCard />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Index actions" />
            <ImportProductsToAlgolia />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
