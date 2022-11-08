import { ProductVariantWebhookPayloadFragment } from "../../../generated/graphql";

type PartialChannelListing = {
  channel: {
    slug: string;
    currencyCode: string;
  };
};

export function channelListingToAlgoliaIndexId(channelListing: PartialChannelListing) {
  return `${channelListing.channel.slug}.${channelListing.channel.currencyCode}.products`;
}

export function productAndVariantToAlgolia({
  product,
  ...variant
}: ProductVariantWebhookPayloadFragment) {
  const attributes = {
    ...product.attributes.reduce((acc, attr, idx) => {
      return { ...acc, [attr.attribute.name ?? ""]: attr.values[idx].name ?? "" };
    }, {}),
    ...variant.attributes.reduce((acc, attr, idx) => {
      return { ...acc, [attr.attribute.name ?? ""]: attr.values[idx].name ?? "" };
    }, {}),
  };

  const object = {
    objectID: productAndVariantToObjectID({ product, ...variant }),
    productId: product.id,
    variantId: variant.id,
    autoGenerateObjectIDIfNotExist: false,
    name: `${product.name} - ${variant.name}`,
    ...attributes,
    description: product.description,
    slug: product.slug,
    thumbnail: product.thumbnail?.url,
  };
  return object;
}

export function productAndVariantToObjectID({
  product,
  ...variant
}: ProductVariantWebhookPayloadFragment) {
  return `${product.id}_${variant.id}`;
}
