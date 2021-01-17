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

class Building extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;
    let { building } = this.context as GlobalContext;

    let buildingString = `{reference}\n{descripton}\n{address}\n{decision} {decisionDate}\nreceived {receivedDate}`;
    const buildingArray = buildingString.split("\n");

    if(building != null) {

      if(building.reference != null)
        buildingString = buildingString.replace("{reference}", building.reference);
      if(building.descripton != null)
        buildingString = buildingString.replace("{descripton}", building.descripton);
      if(building.address != null)
        buildingString = buildingString.replace("{address}", building.address);
      
      if(building.decision != null &&
        building.decision !== "Not Available" &&
        building.decisionDate != null) {
        
        buildingString = buildingString.replace("{decision}", building.decision);
        buildingString = buildingString.replace("{decisionDate}",
          moment(new Date(building.decisionDate)).format("DD/MM/YYYY")
        );
      } else if(building.applicationReceivedDate != null) {

        buildingString = buildingString.replace("{receivedDate}",
          moment(new Date(building.applicationReceivedDate)).format("DD/MM/YYYY")
        );
      }

    }

    if(buildingString.includes("{decisionDate}") &&
      buildingString.includes("{receivedDate}")) {
        buildingString += "(no further details)"
      }

    for(const i in buildingArray) {
      buildingString = buildingString.replace(buildingArray[i], ""); 
    }
    buildingString = buildingString
      .split("\n")
      .filter(buildingSubString => buildingSubString.length > 0)
      .join("\n");

    let display = (
      <>
        <Container className={classes.mainContainer}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          >No Building Info to Show</Typography>
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
                  (buildingString == "(no further details)") ?
                    "NO PLANNING INFO TO SHOW"
                  :
                    buildingString.toUpperCase()
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

export default withStyles(styles, { withTheme: true })(Building);