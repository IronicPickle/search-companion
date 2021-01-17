// Icons imports
import InfoIcon from "@material-ui/icons/Info";

// Main imports
import React, { Component } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Container, Divider, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(2)
  },
  details: {
    display: "block" as "block",
    overflowY: "auto" as "auto",
    maxHeight: theme.spacing(32),
    padding: 0,
    paddingBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class About extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes } = this.props;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <Accordion>
          <AccordionSummary expandIcon={<InfoIcon />}>
            <Typography variant="subtitle2" component="p">
              About
            </Typography>
          </AccordionSummary>
          <Divider className={classes.divider} />
          <AccordionDetails className={classes.details} >
            <Container>
              <Typography
                variant="body1"
                component="div"
              >
                <br/>
                <b>What Does this do?</b><br/>
                <Typography
                  variant="body2"
                  component="p"
                >
                  Search Companion automates various mundane and time consuming tasks.<br/>
                  Below is a list of what it can current do.<br/>
                </Typography>
                <br/>
                <b>Current Capabilities</b><br/>
                <Typography
                  variant="body2"
                  component="p"
                >
                - Automatic CMS Data Extraction<br/>
                - Automatic Planning Application Data Extraction and Formatting<br/>
                - Automatic Building Control Data Extraction and Formatting<br/>
                - TerraFirma Field Auto-Fill<br/>
                - Send Online Mapping Directly to Duct<br/>
                - Open Property on Google Maps<br/>
                </Typography>
              </Typography>
            </Container>
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(About);