import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { ProductEditedDocument, ProductEditedSubscription } from "../../../../../generated/graphql";
import { saleorApp } from "../../../../../saleor-app";
import { handler } from "./_index";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const webhook = new SaleorAsyncWebhook<ProductEditedSubscription["event"]>({
  webhookPath: "api/webhooks/saleor/PRODUCT_DELETED",
  asyncEvent: "PRODUCT_DELETED",
  apl: saleorApp.apl,
  subscriptionQueryAst: ProductEditedDocument,
});

export default webhook.createHandler(handler);
