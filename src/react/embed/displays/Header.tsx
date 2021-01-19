// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, Divider, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap;
  reference?: string;
  type?: string;
  council?: string;
}

interface State {

}

class Header extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes, reference, type, council } = this.props;
    const { settings } = this.context as GlobalContext;

    let display = (
      <>
        <Container>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          ><b>No Order Info Available</b></Typography>
          <Typography
            variant="subtitle2"
            component="h3"
            align="center"
          >Load an order on the CMS to populate this section</Typography>
        </Container>
        <Divider className={classes.divider} />
      </>
    )

    if(reference != null || type != null || council != null) display =  (
      <>
        <Container>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          ><b>{reference} - {type}</b></Typography>
          <Typography
            variant="subtitle2"
            component="h3"
            align="center"
          >{council}</Typography>
        </Container>
        <Divider className={classes.divider} />
      </>
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Header);