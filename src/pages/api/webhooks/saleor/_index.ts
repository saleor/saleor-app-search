import { NextWebhookApiHandler } from "@saleor/app-sdk/handlers/next";
import { ProductEditedSubscription } from "../../../../../generated/graphql";

/**
 * `productUpdatedWebhook` object created earlier provides ready to use handler which validates incoming request.
 * Also it will provide context object containing request properties and most importantly - typed payload.
 */
export const handler: NextWebhookApiHandler<ProductEditedSubscription["event"]> = async (
  req,
  res,
  context
) => {
  const { event, authData } = context;
  console.log(`New event ${event} (${context.payload?.__typename}) from the ${authData.domain} domain has been received!`);

  switch (context.payload?.__typename) {
    case "ProductCreated":
    case "ProductUpdated": {
      const { product } = context.payload;
      if (product) {
        console.log(`Payload contains ${product.name} (id: ${product.id}) product`);
      }
      res.status(200).end();
      return;
    }
    case "ProductVariantCreated":
    case "ProductVariantUpdated": {
      const { productVariant } = context.payload;
      if (productVariant) {
        console.log(`Payload contains ${productVariant.name} (id: ${productVariant.id}) product variant`);
      }
      res.status(200).end();
      return;
    }

    case "ProductDeleted": {
      console.log(`ProductDeleted: ${context.payload.product?.id}`);
      res.status(200).end();
      return;
    }
    case "ProductVariantDeleted": {
      console.log(`ProductVariantDeleted: ${context.payload?.productVariant?.id}`);
      res.status(200).end();
    }
  }
};
