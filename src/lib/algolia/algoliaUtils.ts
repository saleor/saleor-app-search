import { ProductVariantWebhookPayloadFragment } from "../../../generated/graphql";
import { isNotNil } from "../isNotNil";

type PartialChannelListing = {
  channel: {
    slug: string;
    currencyCode: string;
  };
};

export function channelListingToAlgoliaIndexId(
  channelListing: PartialChannelListing,
  indexNamePrefix: string | undefined,
) {
  const nameSegments = [
    indexNamePrefix,
    channelListing.channel.slug,
    channelListing.channel.currencyCode,
    "products",
  ];
  return nameSegments.filter(isNotNil).join(".");
}

/**
 * Produces category tree in the format expected by hierarchical Algolia widgets, for example:
 *
 * {
 *  "lvl0": "Root Category",
 *  "lvl1": "Root Category > Subcategory"
 *  "lvl2": "Root Category > Subcategory > Sub-subcategory"
 * }
 * https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/#hierarchical-facets
 */
export function categoryHierarchicalFacets({ product }: ProductVariantWebhookPayloadFragment) {
  const categoryParents = [
    product.category?.parent?.parent?.parent?.parent?.name,
    product.category?.parent?.parent?.parent?.name,
    product.category?.parent?.parent?.name,
    product.category?.parent?.name,
    product.category?.name,
  ].filter((category) => category?.length);

  const categoryLvlMapping: Record<string, string> = {};

  for (let i = 0; i < categoryParents.length; i += 1) {
    categoryLvlMapping[`lvl${i}`] = categoryParents.slice(0, i + 1).join(" > ");
  }

  return categoryLvlMapping;
}


export type AlgoliaObject = ReturnType<typeof productAndVariantToAlgolia>;

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
    categories: categoryHierarchicalFacets({ product, ...variant }),
  };
  return object;
}

export function productAndVariantToObjectID({
  product,
  ...variant
}: ProductVariantWebhookPayloadFragment) {
  return `${product.id}_${variant.id}`;
}
