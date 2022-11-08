import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import { useCallback, useEffect, useState } from "react";
import {
  ProductWebhookPayloadFragment,
  useChannelsQuery,
  useProductsDataForImportQuery,
} from "../../generated/graphql";
import { AlgoliaSearchProvider } from "../lib/algolia/algoliaSearchProvider";
import { useQueryAllProducts } from "./useQueryAllProducts";

// @todo read configuration from the API
const searchProvider = new AlgoliaSearchProvider({
  appId: "ANKRQ9LXXM",
  apiKey: "2d5407b44db9029601fc8c6054fc74ec",
});

export const ImportProductsToAlgolia = () => {
  const [started, setStarted] = useState(false);
  const products = useQueryAllProducts(!started);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAlgoliaImporting, setIsAlgoliaImporting] = useState(false);
  const importProducts = useCallback(() => {
    setStarted(true);
  }, []);

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
