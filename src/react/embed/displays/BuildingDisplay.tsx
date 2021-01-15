// Icon Imports

// Main imports
import React, { Component } from "react";
import { TextField, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import moment from "moment";

const styles = (theme: Theme) => ({
  field: {
    width: 400
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class BuildingDisplay extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;
    let { building } = this.context as GlobalContext;

    let planningString = `{reference}\n{descripton}\n{address}\n{decision} {decisionDate}\nreceived {receivedDate}`;

    if(building != null) {

      if(building.reference != null)
        planningString = planningString.replace("{reference}", building.reference);
      if(building.descripton != null)
        planningString = planningString.replace("{descripton}", building.descripton);
      if(building.address != null)
        planningString = planningString.replace("{address}", building.address);
      
      if(building.decision != null && building.decisionDate != null) {
        planningString = planningString.replace("{decision}", building.decision);
        planningString = planningString.replace("{decisionDate}",
          moment(new Date(building.decisionDate)).format("DD/MM/YYYY")
        );
        planningString = planningString.replace("\nreceived {receivedDate}", "")
      } else if(building.applicationReceivedDate != null) {
        planningString = planningString.replace("{receivedDate}",
          moment(new Date(building.applicationReceivedDate)).format("DD/MM/YYYY")
        );
        planningString = planningString.replace("\n{decision} {decisionDate}", "")
      }

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

export default withStyles(styles, { withTheme: true })(BuildingDisplay);