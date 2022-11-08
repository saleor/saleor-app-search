import Algoliasearch, { SearchClient } from "algoliasearch";
import {
  ProductVariantWebhookPayloadFragment,
  ProductWebhookPayloadFragment,
} from "../../../generated/graphql";
import { SearchProvider } from "../searchProvider";
import {
  channelListingToAlgoliaIndexId,
  productAndVariantToAlgolia,
  productAndVariantToObjectID,
} from "./algoliaUtils";

export interface AlgoliaSearchProviderOptions {
  appId: string;
  apiKey: string;
}

// @todo implement batch operations
export class AlgoliaSearchProvider implements SearchProvider {
  #algolia: SearchClient;

  constructor({ appId, apiKey }: AlgoliaSearchProviderOptions) {
    this.#algolia = Algoliasearch(appId, apiKey);
  }
  async createProduct(product: ProductWebhookPayloadFragment) {
    console.log(`createProduct`);
    await this.updateProduct(product);
  }
  async updateProduct(product: ProductWebhookPayloadFragment) {
    console.log(`updateProduct`);
    if (!product.variants) {
      return;
    }
    await Promise.all(product.variants.map((variant) => this.updateProductVariant(variant)));
  }
  async deleteProduct(product: ProductWebhookPayloadFragment) {
    console.log(`deleteProduct`);
    if (!product.variants) {
      return;
    }
    await Promise.all(product.variants.map((variant) => this.deleteProductVariant(variant)));
  }
  async createProductVariant(productVariant: ProductVariantWebhookPayloadFragment) {
    console.log(`createProductVariant`);
    return this.updateProductVariant(productVariant);
  }
  async updateProductVariant(productVariant: ProductVariantWebhookPayloadFragment) {
    console.log(`updateProductVariant`);

    if (!productVariant.product.channelListings) {
      return;
    }

    await Promise.all(
      productVariant.product.channelListings
        .filter((channelListing) => channelListing.visibleInListings)
        .map(async (channelListing) => {
          const index = this.#algolia.initIndex(channelListingToAlgoliaIndexId(channelListing));

          const object = productAndVariantToAlgolia(productVariant);
          return index.saveObject(object).wait();
        }),
    );
  }
  async deleteProductVariant(productVariant: ProductVariantWebhookPayloadFragment) {
    console.log(`deleteProductVariant`);

    if (!productVariant.product.channelListings) {
      return;
    }

    await Promise.all(
      productVariant.product.channelListings
        .filter((channelListing) => channelListing.visibleInListings)
        .map(async (channelListing) => {
          const index = this.#algolia.initIndex(channelListingToAlgoliaIndexId(channelListing));
          const objectID = productAndVariantToObjectID(productVariant);
          return index.deleteObject(objectID);
        }),
    );
  }
}
