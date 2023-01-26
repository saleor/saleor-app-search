import { Card, CardContent, CardHeader, List, ListItem, Typography, Link } from "@material-ui/core";
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
        <Typography paragraph>
          How to configure
          <List style={{ marginBottom: 20 }}>
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
          Useful links
          <List>
            <ListItem>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  openExternalUrl("https://github.com/saleor/saleor-app-search");
                }}
              >
                Visit repository & detailed configuration guide
              </Link>
            </ListItem>
          </List>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Instructions;
