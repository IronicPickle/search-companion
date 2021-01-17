// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  
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

    return (
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
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Header);