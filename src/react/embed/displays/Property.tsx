// Icon Imports

// Main imports
import React, { Component } from "react";
import { Box, Container, Divider, TextField, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { orderFields } from "../../../lib/vars";
import Header from "./Header";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48)
  },
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: theme.spacing(45) - theme.spacing(4) - 51,
    overflow: "auto"
  },
  entryToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: theme.spacing(4),
  },
  entryTitle: {
    marginRight: theme.spacing(2)
  },
  field: {
    width: theme.spacing(24)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(2)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class Property extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    let display = (
      <>
        <Container className={classes.mainContainer}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          >No Order to Show</Typography>
          <Divider className={classes.divider} />
          <Typography
            variant="subtitle2"
            component="p"
            align="center"
          >
            Load up an Order on the CMS and this section<br/>
            will display the property's information
          </Typography>
        </Container>
      </>
    )

    if(order != null) display = (
      <>
        <Container className={classes.mainContainer}>
          <Header
            reference={order?.reference}
            type={order?.type}
            council={order?.council} 
          />
          <div className={classes.infoContainer}>
            <Typography
              variant="subtitle2"
              component="div"
            >
              {
                (order != null) ?
                  orderFields.map(orderField => {
                    const title = orderField.name;
                    const value = order.property[orderField.actualId];
                    if(value.length === 0) return;
                    return (
                      <Toolbar disableGutters className={classes.entryToolbar} key={orderField.actualId} >
                        <Box flexGrow={1}>
                          <b className={classes.entryTitle}>{title}</b><br />
                          </Box>
                          <Box>
                          <TextField value={value} InputProps={{ readOnly: true }} className={classes.field} />
                        </Box>
                      </Toolbar>
                    )
                  })
                : <></>
              }
            </Typography>
          </div>
        </Container>
      </>
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Property);