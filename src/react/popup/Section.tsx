// Icons imports

// Main imports
import React, { Component } from "react";
import { Box, IconProps, ListItem, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  bars: {
    width: "100%",
    minHeight: theme.spacing(5)
  },
  item: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0)
  }
});

interface Props {
  classes: ClassNameMap;
  title: string;
  icon: IconProps;
  controller: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

interface State {
  
}

class Section extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes, title, icon, controller, onClick } = this.props;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <ListItem
          button
          onClick={(onClick != null) ? onClick : undefined}
          className={classes.item}
        >
          <Toolbar disableGutters className={classes.bars}>
            <Box display="flex" flexGrow={1} >
            <Toolbar disableGutters className={classes.bars} >
                { icon }
                <Typography
                  variant="subtitle2"
                  component="div"
                  noWrap
                  className={classes.title}
                >{ title }</Typography>
              </Toolbar>
            </Box>
            { controller }
          </Toolbar>
        </ListItem>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Section);