import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlgoliaSearchProvider } from "../lib/algolia/algoliaSearchProvider";
import { useConfiguration } from "../lib/configuration";
import { useQueryAllProducts } from "./useQueryAllProducts";

export const ImportProductsToAlgolia = () => {
  const [started, setStarted] = useState(false);
  const products = useQueryAllProducts(!started);

  const { appBridgeState } = useAppBridge();
  const algoliaConfiguration = useConfiguration(appBridgeState?.domain);

  const searchProvider = useMemo(() => {
    if (!algoliaConfiguration.data?.appId || !algoliaConfiguration.data.secretKey) {
      return null;
    }
    return new AlgoliaSearchProvider({
      appId: algoliaConfiguration.data.appId, // "ANKRQ9LXXM",
      apiKey: algoliaConfiguration.data.secretKey, // "2d5407b44db9029601fc8c6054fc74ec",
    });
  }, [algoliaConfiguration.data?.appId, algoliaConfiguration.data?.secretKey]);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAlgoliaImporting, setIsAlgoliaImporting] = useState(false);
  const importProducts = useCallback(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!searchProvider || isAlgoliaImporting || products.length <= currentProductIndex) {
      return;
    }
    (async () => {
      setIsAlgoliaImporting(true);
      const product = products[currentProductIndex];
      await searchProvider.createProduct(product);
      setIsAlgoliaImporting(false);
      setCurrentProductIndex((i) => i + 1);
    })();
  }, [searchProvider, currentProductIndex, isAlgoliaImporting, products]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button disabled={started || !searchProvider} onClick={importProducts}>
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
