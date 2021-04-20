// Icon Imports
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import OpacityIcon from "@material-ui/icons/Opacity";

// Main imports
import React, { Component } from "react";
import { Box, Container, Divider, Grid, IconButton, Theme, Toolbar, Tooltip, Typography, WithStyles, withStyles, WithTheme } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { createNotification } from "../../../lib/utils";

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
  entryButton: {
    marginLeft: theme.spacing(1)
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

class Files extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes, theme } = this.props;
    const { order } = this.context as GlobalContext;

    let display = (
      <Grid container direction="column" justify="center" className={classes.mainContainer}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          Load up the Documents tab on an Order, on the CMS and<br/>
          this section will display all files stored on the order.
        </Typography>
      </Grid>
    )

    if(order?.files != null && order.files.length > 0) display = (
      <Container className={classes.mainContainer}>
        <div className={classes.infoContainer}>
          <Typography
            variant="subtitle2"
            component="div"
          >
            { order.files.map((fileSet, i) => 
              <div key={i} style={{ marginBottom: theme.spacing(1) }}>
                <Toolbar disableGutters className={classes.entryToolbar} >
                  <Box flexGrow={1}>
                    <b className={classes.entryTitle}>{fileSet.title}</b><br />
                  </Box>
                </Toolbar>
                <Divider />
                { (fileSet.files.length > 0) ?
                    fileSet.files.map((file, i) => 
                      <Toolbar disableGutters className={classes.entryToolbar} key={i} >
                        <Box flexGrow={1}>
                          <span className={classes.entryTitle}>{file.name}</span><br />
                        </Box>
                        <Box>
                          { (file.name === "Online Mapping") &&
                            <IconButton
                              size="small"
                              className={classes.entryButton}
                              href={`duct://upload/?ref=${order.reference}&url=${encodeURIComponent(file.url)}`}
                              onClick={() => chrome.storage.local.set({
                                notification: createNotification({ severity: "success", text: "Send Mapping to Duct" })
                              })}
                              target="_blank"
                            >
                              <Tooltip title="Send to Duct" PopperProps={{ disablePortal: true }} >
                                <OpacityIcon />
                              </Tooltip>
                            </IconButton>
                          }
                          <IconButton
                            size="small"
                            className={classes.entryButton}
                            href={file.url}
                            target="_blank"
                          >
                            <Tooltip title="Open File" PopperProps={{ disablePortal: true }} >
                              <ArrowRightAltIcon style={{ transform:  "rotate(-45deg)" }} />
                            </Tooltip>
                          </IconButton>
                        </Box>
                      </Toolbar>
                    )
                  : <Toolbar disableGutters className={classes.entryToolbar} key={i} >
                      <Box flexGrow={1}>
                        <span className={classes.entryTitle}>No Files</span><br />
                      </Box>
                    </Toolbar>
                }
              </div>
            )}
          </Typography>
        </div>
      </Container>
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Files);