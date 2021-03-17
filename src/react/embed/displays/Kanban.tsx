// Icon Imports

// Main imports
import React, { Component } from "react";
import { Box, Button, Container, Divider, Grid, TextField, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { CMSVersion } from "../../../lib/vars";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48),
    height: 252
  },
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  divider: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  field: {
    width: theme.spacing(24)
  },
  button: {
    marginTop: theme.spacing(4)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class Kanban extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { kanbanOrder } = this.context as GlobalContext;

    if(kanbanOrder == null) return <></>;
    return (
      <>
        <Container className={classes.mainContainer}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          >Extracted KanBan Info</Typography>
          <Divider className={classes.divider} />
          <div className={classes.infoContainer}>
            <Typography
              variant="subtitle2"
              component="div"
            >
              {
                [ { id: "reference", name: "Reference" },
                  { id: "details", name: "Details" },
                  { id: "date", name: "Date" }
                ].map(field => {
                  return (
                    <Toolbar disableGutters className={classes.entryToolbar} key={field.id} >
                      <Box flexGrow={1}>
                        <b className={classes.entryTitle}>{field.name}</b><br />
                        </Box>
                        <Box>
                        <TextField value={kanbanOrder[field.id]} InputProps={{ readOnly: true }} className={classes.field} />
                      </Box>
                    </Toolbar>
                  )
                })
              }
              <Grid
                container
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <Button
                    href={`https://indexcms.co.uk/${CMSVersion}/case-management?goto=${kanbanOrder.reference}`}
                    target="_blank"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Open in CMS
                  </Button>
                </Grid>
              </Grid>
            </Typography>
          </div>
        </Container>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Kanban);