import { NextWebhookApiHandler } from "@saleor/app-sdk/handlers/next";
import { ProductEditedSubscription } from "../../../../../generated/graphql";
import { AlgoliaSearchProvider } from "../../../../lib/algolia/algoliaSearchProvider";

export const handler: NextWebhookApiHandler<ProductEditedSubscription["event"]> = async (
  req,
  res,
  context,
) => {
  const { event, authData } = context;
  console.log(
    `New event ${event} (${context.payload?.__typename}) from the ${authData.domain} domain has been received!`,
  );

  // @todo read configuration from the API
  const searchProvider = new AlgoliaSearchProvider({
    appId: "ANKRQ9LXXM",
    apiKey: "2d5407b44db9029601fc8c6054fc74ec",
  });

  switch (context.payload?.__typename) {
    case "ProductCreated": {
      const { product } = context.payload;
      if (product) {
        await searchProvider.createProduct(product);
      }
      res.status(200).end();
      return;
    }
    case "ProductUpdated": {
      const { product } = context.payload;
      if (product) {
        await searchProvider.updateProduct(product);
      }
      res.status(200).end();
      return;
    }
    case "ProductDeleted": {
      const { product } = context.payload;
      if (product) {
        await searchProvider.deleteProduct(product);
      }
      res.status(200).end();
      return;
    }
    case "ProductVariantCreated": {
      const { productVariant } = context.payload;
      if (productVariant) {
        await searchProvider.createProductVariant(productVariant);
      }
      res.status(200).end();
      return;
    }
    case "ProductVariantUpdated": {
      const { productVariant } = context.payload;
      if (productVariant) {
        await searchProvider.updateProductVariant(productVariant);
      }
      res.status(200).end();
      return;
    }
    case "ProductVariantDeleted": {
      const { productVariant } = context.payload;
      if (productVariant) {
        await searchProvider.deleteProductVariant(productVariant);
      }
      res.status(200).end();
      return;
    }
  }
};
