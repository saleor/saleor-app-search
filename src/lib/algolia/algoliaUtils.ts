import { ProductVariantWebhookPayloadFragment } from "../../../generated/graphql";

type PartialChannelListing = {
  channel: {
    slug: string;
    currencyCode: string;
  };
};

export function channelListingToAlgoliaIndexId(
  channelListing: PartialChannelListing,
  indexNamePrefix?: string,
) {
  const nameSegments = [
    channelListing.channel.slug,
    channelListing.channel.currencyCode,
    "products",
  ];
  if (indexNamePrefix) {
    nameSegments.splice(0, 0, indexNamePrefix);
  }
  return nameSegments.join(".");
}

export function productAndVariantToAlgolia({
  product,
  ...variant
}: ProductVariantWebhookPayloadFragment) {
  const attributes = {
    ...product.attributes.reduce((acc, attr, idx) => {
      return { ...acc, [attr.attribute.name ?? ""]: attr.values[idx]?.name ?? "" };
    }, {}),
    ...variant.attributes.reduce((acc, attr, idx) => {
      return { ...acc, [attr.attribute.name ?? ""]: attr.values[idx]?.name ?? "" };
    }, {}),
  };

  const object = {
    objectID: productAndVariantToObjectID({ product, ...variant }),
    productId: product.id,
    variantId: variant.id,
    name: `${product.name} - ${variant.name}`,
    productName: product.name,
    variantName: variant.name,
    ...attributes,
    description: product.description,
    slug: product.slug,
    thumbnail: product.thumbnail?.url,
    grossPrice: variant.pricing?.price?.gross?.amount,
  };
  return object;
}

export function productAndVariantToObjectID({
  product,
  ...variant
}: ProductVariantWebhookPayloadFragment) {
  return `${product.id}_${variant.id}`;
}
