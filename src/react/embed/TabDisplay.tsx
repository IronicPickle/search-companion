// Main imports
import React, { Component } from "react";
import { Divider, Theme, withStyles, Snackbar } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import OrderDisplay from "./displays/Property";
import PlanningDisplay from "./displays/Planning";
import ProductsDisplay from "./displays/Products";
import Alert from "@material-ui/lab/Alert";
import { Notification, Storage } from "../../lib/interfaces";
import _ from "lodash";
import chromep from "chrome-promise";
import BuildingDisplay from "./displays/Building";

const styles = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap
  currentTab: number;
}

interface State {
  prevNotification?: Notification;
}

class TabDisplay extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

    this.snackbarClose = this.snackbarClose.bind(this);
  }

  snackbarClose() {
    this.setState({ prevNotification: this.context.notification });
  }

  async componentDidMount() {
    const storage = await chromep.storage.local.get() as Storage;
    this.setState({ prevNotification: storage.notification });
  }

  render() {
    const { classes, currentTab } = this.props;
    const { prevNotification } = this.state;
    const { settings, order, notification } = this.context as GlobalContext;

    if(displays[currentTab] == null) return <></>;

    return (
      <>
        <Divider className={classes.divider} />
        {displays[currentTab].component}
        
        {
          (notification != null) ?
          <Snackbar open={!_.isEqual(prevNotification, notification)} onClose={this.snackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} autoHideDuration={2000}>
            <Alert severity={notification.settings.severity}>{notification.settings.text}</Alert>
          </Snackbar>
          : <></>
        }
        
      </>
    )

  }
}

export const displays: any[] = [
  { name: "Property Info", component: <OrderDisplay/> },
  { name: "Products", component: <ProductsDisplay/> },
  { name: "Planning Application Info", component: <PlanningDisplay/> },
  { name: "Building Regulation Info", component: <BuildingDisplay/> }
]

export default withStyles(styles, { withTheme: true })(TabDisplay);