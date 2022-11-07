import {
  ProductWebhookPayloadFragment,
  Product,
  ProductVariantWebhookPayloadFragment,
  ProductVariant,
} from "../../generated/graphql";

export interface SearchProvider {
  createProduct(product: ProductWebhookPayloadFragment): Promise<void>;
  updateProduct(product: ProductWebhookPayloadFragment): Promise<void>;
  deleteProduct(productId: Product["id"]): Promise<void>;
  createProductVariant(productVariant: ProductVariantWebhookPayloadFragment): Promise<void>;
  updateProductVariant(productVariant: ProductVariantWebhookPayloadFragment): Promise<void>;
  deleteProductVariant(productId: ProductVariant["id"]): Promise<void>;
}
