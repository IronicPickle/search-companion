// Icon Imports

// Main imports
import React, { Component } from "react";
import { Box, Container, Divider, Grid, TextField, Theme, Toolbar, Typography, withStyles, WithTheme } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap, WithStyles } from "@material-ui/core/styles/withStyles";
import { orderFields } from "../../../lib/vars";
import moment from "moment";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48),
    height: 252,
    overflow: "auto"
  },
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
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

interface Props extends WithStyles<typeof styles>, WithTheme {

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
    const { classes, theme } = this.props;
    const { order } = this.context as GlobalContext;

    const { originalReturnDate, latestReturnDate, status } = order || {};
    const returnDate = latestReturnDate || originalReturnDate;

    const isOverdue = (returnDate == null) ? false : returnDate < new Date().getTime();

    let display = (
      <Grid container direction="column" justify="center" className={classes.mainContainer}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          Load up an Order on the CMS and this section<br/>
          will display the property's information
        </Typography>
      </Grid>
    )

    if(order != null) display = (
      <>
        <Container className={classes.mainContainer}>
          { (isOverdue && status) && <Typography
            variant="caption"
            component="div"
            align="center"
            style={{ fontWeight: 600 }}
          >
            <span style={{ color: theme.palette.error.dark }}>Order Overdue </span>
            - {moment(returnDate).format("DD/MM/YYYY")}
          </Typography> }
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