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
                  <br/>Search Companion brings convenience and automation to various tasks.<br/><br/>

                  <b>Automation:</b><br/>
                  - Auto-filling property information when ordering reports.<br/>
                  - Automatic formatting of Planning Applications and Building Regulations.<br/>
                  - Automatic creation of KanBan cards for Products and Searches.<br/>
                  
                  <br/><b>Convenience:</b><br/>
                  - Displays your current order's information on all tabs for easy access.<br/>
                  - Keeps a history of all the orders you have visited.<br/>
                  - Opens directly to a property on Google Maps.<br/>
                  - Sends Online Mapping directly to Duct and Order Info for the creation of Official Search Forms (LLC1, Con29R & Con29O).
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