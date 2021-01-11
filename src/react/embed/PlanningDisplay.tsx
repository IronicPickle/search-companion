// Icon Imports

// Main imports
import React, { Component } from "react";
import { TextField, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import moment from "moment";

const styles = (theme: Theme) => ({
  field: {
    width: 400
  }
});

interface PropsI {
  classes: ClassNameMap;
}

interface StateI {
  
}

class PlanningDisplay extends Component<PropsI, StateI> {
  static contextType = globalContext;
  constructor(props: PropsI) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;
    let { planning } = this.context as GlobalContext;

    let planningString = `{reference}\n{descripton}\n{address}\n{decision} {decisionDate}`;

    if(planning != null) {
      if(planning.reference != null)
        planningString = planningString.replace("{reference}", planning.reference);
      if(planning.descripton != null)
        planningString = planningString.replace("{descripton}", planning.descripton);
      if(planning.address != null)
        planningString = planningString.replace("{address}", planning.address);

      if(planning.decision != null) {
        planning.decision = decisions[planning.decision.toLocaleLowerCase()] || planning.decision;
        planningString = planningString.replace("{decision}", planning.decision);
      }
      if(planning.decisionIssuedDate != null)
        planningString = planningString.replace("{decisionDate}",
          moment(new Date(planning.decisionIssuedDate)).format("DD/MM/YYYY")
        );
      if(planning.decisionMadeDate != null)
        planningString = planningString.replace("{decisionDate}",
          moment(new Date(planning.decisionMadeDate)).format("DD/MM/YYYY")
        );

    }

    return (
      <>
        <TextField
          value={planningString.toUpperCase()}
          className={classes.field}
          multiline={true}
          rowsMax={10}
        />
      </> 
    )
  }
}

const decisions: { [key: string]: string } = {
  "approved": "APPROVED WITH CONDITIONS",
  "granted": "APPROVED WITH CONDITIONS",
  "approve": "APPROVED WITH CONDITIONS",
  "grant": "APPROVED WITH CONDITIONS",
  "refuse": "REFUSED",
  "application withdrawn": "WITHDRAWN"
}

export default withStyles(styles, { withTheme: true })(PlanningDisplay);