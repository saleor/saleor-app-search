import { Card, CardHeader } from "@material-ui/core";
import { ImportProductsToAlgolia } from "./ImportProductsToAlgolia";
import AlgoliaConfigurationCard from "./AlgoliaConfigurationCard";

export const DashboardActions = () => {
  return (
    <div>
      <AlgoliaConfigurationCard />
      <Card>
        <CardHeader title="Index actions" />
        <ImportProductsToAlgolia />
      </Card>
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
