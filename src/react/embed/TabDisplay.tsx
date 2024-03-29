// Main imports
import React, { Component } from "react";
import { Divider, Theme, withStyles, Snackbar, WithTheme, Box } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import Planning from "./displays/Planning";
import Products from "./displays/Products";
import Alert from "@material-ui/lab/Alert";
import { Notification, Storage } from "../../lib/interfaces";
import _ from "lodash";
import chromep from "chrome-promise";
import Header from "./Header";
import Building from "./displays/Building";
import History from "./displays/History";
import Property from "./displays/Property";
import Kanban from "./displays/Kanban";
import Mapping from "./displays/Mapping";
import Files from "./displays/Files";

const styles = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

interface Props extends WithStyles<typeof styles>, WithTheme {
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
    const { classes, theme, currentTab } = this.props;
    const { prevNotification } = this.state;
    const { notification, order } = this.context as GlobalContext;

    if(displays[currentTab] == null) return <></>;

    return (
      <Box flexGrow={1} display="flex" flexDirection="column" style={{ overflow: "hidden" }}>
        <Divider className={classes.divider} />
        <Header
          reference={order?.reference}
          type={order?.type}
          council={order?.council}
          water={order?.water}
        />
        <Divider className={classes.divider} />
        { React.createElement(displays[currentTab].component, { style: {
          paddingRight: 0,
          paddingLeft: 0,
          marginBottom: theme.spacing(2),
          minWidth: theme.spacing(48),
          flexGrow: 1,
          overflow: "auto"
        } }) }
        {
          (notification != null) ?
            <Snackbar
              open={!_.isEqual(prevNotification, notification)}
              onClose={this.snackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              autoHideDuration={2000}
            >
              <Alert severity={notification.settings.severity}>{notification.settings.text}</Alert>
            </Snackbar>
          : <></>
        }
      </Box>
    )

  }
}

export const displays: any[] = [
  { name: "Property Info", component: Property },
  { name: "Products", component: Products },
  { name: "Planning Application Info", component: Planning },
  { name: "Building Regulation Info", component: Building },
  { name: "Order History", component: History },
  { name: "Mapping", component: Mapping },
  { name: "Files", component: Files },
  { name: "KanBan", component: Kanban }
]

export default withStyles(styles, { withTheme: true })(TabDisplay);