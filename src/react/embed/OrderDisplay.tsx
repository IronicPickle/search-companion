// Icon Imports

// Main imports
import React, { Component } from "react";
import { Box, Container, TextField, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { orderFields } from "../../lib/vars";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0
  },
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: "50vh",
    overflow: "auto"
  },
  entryToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: theme.spacing(4),
  },
  entryTitle: {
    marginRight: theme.spacing(2)
  }, field: {
    width: theme.spacing(24)
  }
});

interface PropsI {
  classes: ClassNameMap;
}

interface StateI {
  
}

class OrderDisplay extends Component<PropsI, StateI> {
  static contextType = globalContext;
  constructor(props: PropsI) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        <Container className={classes.mainContainer}>
          <Container>
            <Typography
              variant="subtitle1"
              component="h2"
              align="center"
            ><b>{order?.reference} - {order?.type}</b></Typography>
            <Typography
              variant="subtitle2"
              component="h3"
              align="center"
            >{order?.council}</Typography>
          </Container>
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
  }
}

export default withStyles(styles, { withTheme: true })(OrderDisplay);