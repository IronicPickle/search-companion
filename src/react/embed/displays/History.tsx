// Icon Imports
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

// Main imports
import React, { Component } from "react";
import { Box, Container, Divider, Grid, IconButton, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import moment from "moment";
import { cmsVersion } from "../../../lib/vars";

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
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  },
  entryTitle: {
    marginRight: theme.spacing(2)
  },
  openLinkButton: {
    marginLeft: theme.spacing(1)
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

class History extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { order } = this.context as GlobalContext;
    const orderHistory = (this.context as GlobalContext).orderHistory || [];

    let display = (
      <Grid container direction="column" justify="center" className={classes.mainContainer}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          This section will populate with the last 25 orders you<br/>
          have visited.
        </Typography>
      </Grid>
    )

    if(orderHistory.length > 0) display = (
      <>
        <Container className={classes.mainContainer}>
          <div className={classes.infoContainer}>
            <Typography
              variant="subtitle2"
              component="div"
            >
              {
                orderHistory.map(order => {
                  const property = order.property;
                  return (
                    <Tooltip
                      title={`Last Viewed: ${moment(new Date(order.lastViewed)).format("HH:mm DD/MM ")}`}
                      PopperProps={{ disablePortal: true }}
                      key={order.reference}
                    >
                      <Toolbar disableGutters className={classes.entryToolbar} >
                        <Box flexGrow={1}>
                          <b className={classes.entryTitle}>{order.reference}</b><br />
                        </Box>
                        <Box>
                          {property.houseNumber || property.houseName || property.companyName} {property.street}
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            className={classes.openLinkButton}
                            href={`https://indexcms.co.uk/${cmsVersion}/case-management?goto=${order.reference}`}
                          >
                            <Tooltip title="Go to Order" PopperProps={{ disablePortal: true }} >
                              <ArrowRightAltIcon style={{ transform: "rotate(-45deg)" }} />
                            </Tooltip>
                          </IconButton>
                        </Box>
                      </Toolbar>
                    </Tooltip>
                  )
                })
              }
            </Typography>
          </div>
        </Container>
      </>
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(History);