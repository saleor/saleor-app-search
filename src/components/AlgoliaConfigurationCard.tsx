import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import { Card, CardActions, CardHeader, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { AlgoliaConfigurationFields } from "../lib/algolia/types";
import { fetchConfiguration } from "../lib/configuration";

export const AlgoliaConfigurationCard = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const { register, handleSubmit, setValue } = useForm<AlgoliaConfigurationFields>();

  const { token, domain } = appBridgeState || {};

  const reactQueryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["configuration"],
    onSuccess(data) {
      setValue("secretKey", data?.secretKey || "");
      setValue("searchKey", data?.searchKey || "");
      setValue("appId", data?.appId || "");
    },
    queryFn: async () => fetchConfiguration(domain!),
    enabled: !!token && !!domain,
  });

  const isFormDisabled = isLoading || !token || !domain;

  const onFormSubmit = handleSubmit(async (conf) =>
    fetch("/api/configuration", {
      method: "POST",
      headers: {
        "saleor-domain": domain!,
      },
      body: JSON.stringify(conf),
    })
      .then(async (resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          await appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "success",
              title: "Saved configuration",
              actionId: "message-from-app",
            },
          });
          return reactQueryClient.refetchQueries({
            queryKey: ["configuration"],
          });
        } else {
          appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "error",
              title: "Could not save",
              text: `Response status: ${resp.status}`,
              actionId: "message-from-app",
            },
          });
        }
      })
      .catch((e) =>
        appBridge?.dispatch({
          type: "notification",
          payload: {
            status: "error",
            title: "Could not save",
            text: `${e.toString()}`,
            actionId: "message-from-app",
          },
        }),
      ),
  );

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
          <CardActions style={{ padding: "30px 0 0 0" }}>
            <Button disabled={isFormDisabled} type="submit" variant="primary">
              Save
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
