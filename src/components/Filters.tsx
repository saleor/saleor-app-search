import { Card, CardContent, CardHeader } from "@material-ui/core";
import { DynamicWidgets, RangeInput, RefinementList } from "react-instantsearch-hooks-web";
import styles from "../styles/search.module.css";

export const Filters = () => (
  <Card>
    <CardHeader title={"Filters"} />
    <CardContent>
      <DynamicWidgets>
        <RefinementList attribute="Material" />
        <RefinementList attribute="Size" />
        <RangeInput attribute="grossPrice" />
      </DynamicWidgets>
    </CardContent>
  </Card>
);
