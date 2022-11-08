import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { ImportProductsToAlgolia } from "./ImportProductsToAlgolia";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * You can safely remove this file!
 */
export const DashboardActions = () => {
  return (
    <div>
      <h2>Saleor App Search</h2>
      <ImportProductsToAlgolia />
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
