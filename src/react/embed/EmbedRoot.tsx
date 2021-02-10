// Main Imports
import React, { DragEvent } from "react";
import { Container, Paper, Theme } from "@material-ui/core";
import withStyles, { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { Component } from "react";
import { globalContext, GlobalContext } from "../contexts";
import TabController from "./TabController";

const styles = (theme: Theme) => ({
  outerContainer: {
    padding: theme.spacing(0.25),
    whiteSpace: "nowrap" as "nowrap"
  },
  innerContainer: {
    padding: theme.spacing(1),
    whiteSpace: "nowrap" as "nowrap",
    cursor: "all-scroll"
  },
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
      height: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": `inset 0 0 6px ${theme.palette.secondary.main}`
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.main,
      outline: `1px solid ${theme.palette.secondary.main}`
    }
  }
});

interface Props {
  classes: ClassNameMap
}

interface State {
  dragOffset: { x: number, y: number }
}

class EmbedRoot extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {
      dragOffset: { x: 0, y: 0 }
    }

    this.iframeDragStart = this.iframeDragStart.bind(this);
    this.iframeDragEnd = this.iframeDragEnd.bind(this);
    
  }

  iframeDragStart(event: DragEvent<HTMLDivElement>) {
    this.setState({ dragOffset: { x: event.clientX, y: event.clientY } })
  }

  iframeDragEnd(event: DragEvent<HTMLDivElement>) {
    const dragOffset = this.state.dragOffset;
    window.parent.postMessage({ position: {
      x: event.clientX, y: event.clientY
    }, dragOffset }, "*");
  }


  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        {
          (settings.embeddedState && settings.extensionState) ?
            <Container className={classes.outerContainer}>
              <Paper className={classes.innerContainer} draggable onDragStart={this.iframeDragStart} onDragEnd={this.iframeDragEnd}>
                <TabController />
              </Paper>
            </Container>
          : <></>
        }
        
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EmbedRoot);