import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import { useCallback, useEffect, useState } from "react";
import {
  ProductWebhookPayloadFragment,
  useProductsDataForImportQuery,
} from "../../generated/graphql";
import { AlgoliaSearchProvider } from "../lib/algolia/algoliaSearchProvider";

const PER_PAGE = 10;

// @todo read configuration from the API
const searchProvider = new AlgoliaSearchProvider({
  appId: "ANKRQ9LXXM",
  apiKey: "2d5407b44db9029601fc8c6054fc74ec",
});

export const ImportProductsToAlgolia = () => {
  const [started, setStarted] = useState(false);
  const [products, setProducts] = useState<ProductWebhookPayloadFragment[]>([]);
  const [cursor, setCursor] = useState("");
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAlgoliaImporting, setIsAlgoliaImporting] = useState(false);

  const importProducts = useCallback(() => {
    setStarted(true);
  }, []);

  const [productsResponse] = useProductsDataForImportQuery({
    variables: {
      after: cursor,
      first: PER_PAGE,
    },
    pause: !started,
  });
  useEffect(() => {
    if (!productsResponse.fetching && !productsResponse.error && productsResponse.data?.products) {
      setProducts((ps) => [
        ...ps,
        ...(productsResponse.data?.products?.edges.map((e) => e.node) || []),
      ]);
      if (productsResponse.data.products.pageInfo.endCursor) {
        setCursor(productsResponse.data.products.pageInfo.endCursor);
      }
    }
    productsResponse;
  }, [productsResponse]);

  useEffect(() => {
    if (isAlgoliaImporting || products.length <= currentProductIndex) {
      return;
    }
    (async () => {
      setIsAlgoliaImporting(true);
      const product = products[currentProductIndex];
      await searchProvider.createProduct(product);
      setIsAlgoliaImporting(false);
      setCurrentProductIndex((i) => i + 1);
    })();
  }, [currentProductIndex, isAlgoliaImporting, products]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button disabled={started} onClick={importProducts}>
        Start importing products to Algolia
      </Button>
      {started && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {currentProductIndex} / {products.length}
          <progress
            value={currentProductIndex}
            max={products.length}
            style={{
              height: "30px",
              width: "500px",
              maxWidth: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};
