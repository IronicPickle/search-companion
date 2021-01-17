// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import moment from "moment";
import Header from "./Header";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48)
  },
  field: {
    margin: theme.spacing(2),
    width: theme.spacing(64)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class Planning extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;
    let { planning } = this.context as GlobalContext;

    let planningString = `{reference}\n{descripton}\n{address}\n{decision} {decisionDate}\nreceived {receivedDate}`;
    const planningArray = planningString.split("\n");

    if(planning != null) {
      if(planning.reference != null)
        planningString = planningString.replace("{reference}", planning.reference);
      if(planning.descripton != null)
        planningString = planningString.replace("{descripton}", planning.descripton);
      if(planning.address != null)
        planningString = planningString.replace("{address}", planning.address);

      if(planning.decision != null &&
        (planning.decisionMadeDate != null || planning.decisionIssuedDate)) {
        planning.decision = decisions[planning.decision.toLowerCase()] || planning.decision;
        planningString = planningString.replace("{decision}", planning.decision);
        if(planning.decisionIssuedDate != null)
          planningString = planningString.replace("{decisionDate}",
            moment(new Date(planning.decisionIssuedDate)).format("DD/MM/YYYY")
          );
        if(planning.decisionMadeDate != null)
          planningString = planningString.replace("{decisionDate}",
            moment(new Date(planning.decisionMadeDate)).format("DD/MM/YYYY")
          );
      } else if(planning.applicationReceivedDate != null) {
        planningString = planningString.replace("{receivedDate}",
          moment(new Date(planning.applicationReceivedDate)).format("DD/MM/YYYY")
        );
      }

    }

    if(planningString.includes("{decisionDate}") &&
      planningString.includes("{receivedDate}")) {
        planningString += "(no further details)"
      }

    for(const i in planningArray) {
      planningString = planningString.replace(planningArray[i], ""); 
    }
    planningString = planningString
      .split("\n")
      .filter(planningSubString => planningSubString.length > 0)
      .join("\n");

    let display = (
      <>
        <Container className={classes.mainContainer}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          >No Planning Info to Show</Typography>
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
              <TextField
                value={
                  (planningString == "(no further details)") ?
                    "NO PLANNING INFO TO SHOW"
                  :
                    planningString.toUpperCase()
                }
                className={classes.field}
                multiline={true}
                rows={10}
                variant="outlined"
              />
            </Typography>
          </div>
        </Container>
      </> 
    )

    return display;
  }
}

const decisions: { [key: string]: string } = {
  "approved": "APPROVED WITH CONDITIONS",
  "granted": "APPROVED WITH CONDITIONS",

  "approve": "APPROVED WITH CONDITIONS",
  "grant": "APPROVED WITH CONDITIONS",

  "grant subject to conditions": "APPROVED WITH CONDITIONS",
  
  "approve with conditions": "APPROVED WITH CONDITIONS",

  "refuse": "REFUSED",
  "application withdrawn": "WITHDRAWN"
}

export default withStyles(styles, { withTheme: true })(Planning);