import { Card, CardContent } from "@material-ui/core";
import { DynamicWidgets, RangeInput, RefinementList } from "react-instantsearch-hooks-web";
import styles from "./search.module.css";

export const Filters = () => (
  <Card>
    <h3 className={styles.filters}>Filters</h3>
    <CardContent>
      <DynamicWidgets>
        <RefinementList attribute="Material" />
        <RefinementList attribute="Size" />
        <RangeInput attribute="grossPrice" />
      </DynamicWidgets>
    </CardContent>
  </Card>
);
