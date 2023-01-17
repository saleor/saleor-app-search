import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import { Card, CardActions, CardHeader, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { AlgoliaConfigurationFields } from "../lib/algolia/types";
import { fetchConfiguration } from "../lib/configuration";

export const AlgoliaConfigurationCard = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const { register, handleSubmit, setValue } = useForm<AlgoliaConfigurationFields>();

  const { token, saleorApiUrl } = appBridgeState || {};

  const reactQueryClient = useQueryClient();

  const { isLoading: isQueryLoading } = useQuery({
    queryKey: ["configuration"],
    onSuccess(data) {
      setValue("secretKey", data?.secretKey || "");
      setValue("searchKey", data?.searchKey || "");
      setValue("appId", data?.appId || "");
      setValue("indexNamePrefix", data?.indexNamePrefix || "");
    },
    queryFn: async () => fetchConfiguration(saleorApiUrl!, token!),
    enabled: !!token && !!saleorApiUrl,
  });

  const { mutate, isLoading: isMutationLoading } = useMutation(
    async (conf: AlgoliaConfigurationFields) => {
      const resp = await fetch("/api/configuration", {
        method: "POST",
        headers: {
          "saleor-api-url": saleorApiUrl!,
          "authorization-bearer": token!,
        },
        body: JSON.stringify(conf),
      });
      if (resp.status >= 200 && resp.status < 300) {
        const data = (await resp.json()) as { data?: AlgoliaConfigurationFields };
        return data.data;
      }
      throw new Error(`Server responded with status code ${resp.status}`);
    },
    {
      onSuccess: async () => {
        reactQueryClient.refetchQueries({
          queryKey: ["configuration"],
        });
        appBridge?.dispatch({
          type: "notification",
          payload: {
            status: "success",
            title: "Configuration saved!",
            actionId: "message-from-app",
          },
        });
      },
      onError: async (data: Error) => {
        appBridge?.dispatch({
          type: "notification",
          payload: {
            status: "error",
            title: "Could not save the configuration",
            text: data.message,
            actionId: "message-from-app",
          },
        });
      },
    },
  );

  const onFormSubmit = handleSubmit(async (conf) => mutate(conf));

  const isFormDisabled = isMutationLoading || isQueryLoading || !token || !saleorApiUrl;

  return (
    <Card>
      <form onSubmit={onFormSubmit}>
        <CardHeader title="Configure Algolia settings"></CardHeader>
        <div style={{ padding: "0 30px 30px" }}>
          <TextField
            variant="standard"
            disabled={isFormDisabled}
            label="Secret key"
            {...register("secretKey")}
            fullWidth
          />
          <TextField
            variant="standard"
            disabled={isFormDisabled}
            label="Search key"
            {...register("searchKey")}
            fullWidth
          />
          <TextField
            variant="standard"
            disabled={isFormDisabled}
            label="App ID"
            {...register("appId")}
            fullWidth
          />
          <TextField
            variant="standard"
            disabled={isFormDisabled}
            label="Index name prefix"
            {...register("indexNamePrefix")}
            fullWidth
          />
          <CardActions style={{ padding: "30px 0 0 0" }}>
            <Button disabled={isFormDisabled} type="submit" variant="primary">
              {isFormDisabled ? "Loading..." : "Save"}
            </Button>
          </CardActions>
        </div>
      </form>
    </Card>
  );
};

/**
 * Export default for Next.dynamic
 */
export default AlgoliaConfigurationCard;
