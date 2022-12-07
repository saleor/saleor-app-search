import { Card, CardContent, CardHeader, List, ListItem, Typography } from "@material-ui/core";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";

function Instructions() {
  const { appBridge } = useAppBridge();

  const algoliaDashboardUrl = "https://www.algolia.com/apps/dashboard";

  const openExternalUrl = (to: string) => {
    appBridge?.dispatch({
      type: "redirect",
      payload: {
        newContext: true,
        actionId: "redirect_from_search_app",
        to,
      },
    });
  };

  return (
    <Card>
      <CardHeader title="Instructions" />
      <CardContent>
        <Typography>How to configure</Typography>
        <List>
          <ListItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                openExternalUrl(algoliaDashboardUrl);
              }}
              href={algoliaDashboardUrl}
            >
              Create a new Algolia application
            </a>
          </ListItem>
          <ListItem>
            Navigate to application keys section and copy values to the form below
          </ListItem>
          <ListItem>Save configuration</ListItem>
        </List>
        <Typography>Useful links</Typography>
        <List>
          <ListItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                openExternalUrl("https://github.com/saleor/saleor-app-search");
              }}
              href="https://github.com/saleor/saleor-app-search"
            >
              Visit repository & detailed configuration guide
            </a>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default Instructions;
