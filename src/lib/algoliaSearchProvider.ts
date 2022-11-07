import {
  ProductWebhookPayloadFragment,
  Product,
  ProductVariantWebhookPayloadFragment,
  ProductVariant,
} from "../../generated/graphql";
import { SearchProvider } from "./searchProvider";

export class AlgoliaSearchProvider implements SearchProvider {
  async createProduct(product: ProductWebhookPayloadFragment) {
    throw new Error("Method not implemented.");
  }
  async updateProduct(product: ProductWebhookPayloadFragment) {
    throw new Error("Method not implemented.");
  }
  async deleteProduct(productId: Product["id"]) {
    throw new Error("Method not implemented.");
  }
  async createProductVariant(productVariant: ProductVariantWebhookPayloadFragment) {
    throw new Error("Method not implemented.");
  }
  async updateProductVariant(productVariant: ProductVariantWebhookPayloadFragment) {
    throw new Error("Method not implemented.");
  }
  async deleteProductVariant(productId: ProductVariant["id"]) {
    throw new Error("Method not implemented.");
  }
}
