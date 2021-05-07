// Icon Imports

// Main imports
import React, { Component, CSSProperties } from "react";
import { Container, Grid, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import moment from "moment";

const styles = (theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    width: theme.spacing(64)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(2)
  }
});

interface Props extends WithStyles<typeof styles> {
  style: CSSProperties;
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
    const { style, classes } = this.props;
    let { building } = this.context as GlobalContext;

    let buildingString = `{reference}\n{descripton}\n{address}\n{extra} {extraDate}\n{decision} {decisionDate}\nreceived {receivedDate}`;
    const buildingArray = buildingString.split("\n");

    if(building != null) {

      if(building.reference != null)
        buildingString = buildingString.replace("{reference}", building.reference);
      if(building.descripton != null)
        buildingString = buildingString.replace("{descripton}", building.descripton);
      if(building.address != null)
        buildingString = buildingString.replace("{address}", building.address);
      
      if(building.extra != null && building.extraDate != null) {
        
        buildingString = buildingString.replace("{extra}", building.extra);
        buildingString = buildingString.replace("{extraDate}",
          moment(new Date(building.extraDate)).format("DD/MM/YYYY")
        );
      }
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

    if(buildingString.includes("{decisionDate}") && buildingString.includes("{receivedDate}")) {
      buildingString += "(no further details)"
    }
    if(buildingString.includes("{extra} {extraDate}")) {
      buildingString = buildingString.replace("\n{extra} {extraDate}", "");
    }

    for(const i in buildingArray) {
      buildingString = buildingString.replace(buildingArray[i], ""); 
    }
    buildingString = buildingString
      .split("\n")
      .filter(buildingSubString => buildingSubString.length > 0)
      .join("\n");

    let display = (
      <Grid container direction="column" justify="center" style={style}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          Load up a Building Regulation on a council's website<br/>
          and this section will format the information.
        </Typography>
      </Grid>
    )

    if(buildingString !== "(no further details)") display = (
      <>
        <Container style={style}>
          <Typography
            variant="subtitle2"
            component="div"
          >
            <TextField
              value={buildingString.toUpperCase()}
              className={classes.field}
              multiline={true}
              rows={10}
              variant="outlined"
            />
          </Typography>
        </Container>
      </> 
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Building);