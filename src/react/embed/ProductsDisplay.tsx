// Icon Imports

// Main imports
import React, { Component } from "react";
import { Box, Container, Divider, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

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
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  },
  entryTitle: {
    marginRight: theme.spacing(2)
  },
  divider: {
    marginRight: theme.spacing(2)
  }
});

interface PropsI {
  classes: ClassNameMap;
}

interface StateI {
  
}

class ProductsDisplay extends Component<PropsI, StateI> {
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
                  order.products.map(product => {
                    const tooltip = (product.returned == null) ?
                      "Not returned"
                    : `Returned: ${product.returned}`
                    return (
                      <Tooltip title={tooltip} PopperProps={{ disablePortal: true }} >
                        <Toolbar disableGutters className={classes.entryToolbar} key={product.name} >
                          <Box flexGrow={1}>
                            <b className={classes.entryTitle}>{product.name}</b><br />
                            </Box>
                            <Box>
                            £{product.cost}
                          </Box>
                        </Toolbar>
                      </Tooltip>
                    )
                  })
                : <></>
              }
              <Divider className={classes.divider} />
              <Toolbar disableGutters className={classes.entryToolbar} key="totalCost" >
                <Box flexGrow={1}>
                  <b className={classes.entryTitle}>Total Cost </b><br />
                  </Box>
                  <Box>
                  £{order?.totalCost}
                </Box>
              </Toolbar>
            </Typography>
          </div>
        </Container>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ProductsDisplay);