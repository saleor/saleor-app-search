import { Card, CardHeader } from "@material-ui/core";
import { ImportProductsToAlgolia } from "./ImportProductsToAlgolia";
import AlgoliaConfigurationCard from "./AlgoliaConfigurationCard";
import { Grid } from "@material-ui/core";

export const DashboardActions = () => {
  return (
    <div>
      <Grid container spacing={4}>
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
