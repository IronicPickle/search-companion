// Icon imports
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Box, Collapse, Divider, IconButton, Menu, MenuItem, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import TabDisplay, { displays } from "./TabDisplay";
import TabBar from "./TabBar";
import { kanbanGetMenuData, kanbanInsertProducts, kanbanInsertSearch } from "../../lib/kanban";
import { formToDuct } from "../../lib/form";

const styles = (theme: Theme) => ({
  header: {
    minHeight: theme.spacing(6)
  },
  title: {
    width: "100%",
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6)
  },
  dropdownButton: {
    transition: theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.short
    })
  },
  divider: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  closeIcon: {
    position: "absolute" as "absolute"
  },
  moreOptionsIcon: {
    position: "absolute" as "absolute",
    right: theme.spacing(2)
  },
  menuItem: {
    minHeight: 0
  }
});

interface Props {
  classes: ClassNameMap
}

interface State {
  currentTab: number;
  tabBarState: boolean;
  anchorElement: HTMLElement | null;
  menuData?: MenuData[];
}

export interface MenuData {
  title: string;
  options: {
    title: string;
    onClick: (...args: any) => any;
  }[]
}

class TabController extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {
      currentTab: displays.length,
      tabBarState: false,
      anchorElement: null
    }
    
    this.changeTab = this.changeTab.bind(this);
    this.toggleTabBar = this.toggleTabBar.bind(this);
    this.menuOpen = this.menuOpen.bind(this);
    this.menuClose = this.menuClose.bind(this);
  }
  
  menuClose() {
    this.setState({ anchorElement: null });
    window.postMessage("closePopover", "*");
  }

  menuOpen(event: MouseEvent<HTMLButtonElement>) {
    const menuData: MenuData[] = [];
    const kanbanActive = window.location.href.includes("https://kanbanflow.com/board");

    menuData.push(
      { title: "Generate Forms", options: [
        { title: "LLC", onClick: () => {
          formToDuct("llc"), this.menuClose();
        } },
        { title: "Con29R", onClick: () => {
          formToDuct("con29r"), this.menuClose();
        } },
        { title: "Con29O", onClick: () => {
          formToDuct("con29o"), this.menuClose();
        } }
      ] }
    )

    if(kanbanActive) {
      menuData.push(
        { title: "KanBan Options", options: [
          { title: "Insert Search", onClick: () => {
            this.setState({
              menuData: kanbanGetMenuData((id: string) => {
                kanbanInsertSearch(id); this.menuClose();
              })
            });
          }}, { title: "Insert Products", onClick: () => {
              this.setState({
                menuData: kanbanGetMenuData((id: string) => {
                  kanbanInsertProducts(id); this.menuClose();
                })
            });;
          }}
        ] }
      )
    }

    if(menuData.length === 0) menuData.push({ title: "No Options Available", options: [] } );
    this.setState({ anchorElement: event.currentTarget, menuData: menuData});
  }

  componentDidMount() {
    const { settings } = this.context;
    chrome.storage.onChanged.addListener(async (changes) => {
      if(changes.notification != null) {
        const notification = changes.notification.newValue;
        if(notification.href !== window.location.href) return;
        const tabOverride = notification.tabOverride;
        if(tabOverride != null && settings.notificationsState &&
          settings.extensionState) this.changeTab(tabOverride);
      }
    });

    this.context.openTab = this.changeTab;
  }

  changeTab(index: number) {
    this.setState({ tabBarState: true, currentTab: index });
  }

  toggleTabBar(event: MouseEvent<HTMLButtonElement>) {
    this.setState({ tabBarState: !this.state.tabBarState, currentTab: displays.length });
  }

  render() {
    const { classes } = this.props;
    const { currentTab, tabBarState, anchorElement, menuData } = this.state;
    const { settings, order } = this.context as GlobalContext;

    const currentDisplay = displays[currentTab];

    return (
      <>
        <Box display="flex">
          <Box flexGrow={1} hidden={currentDisplay == null}>
            <Toolbar disableGutters={true} className={classes.header} hidden={currentDisplay == null} >
              <Tooltip title="Close" PopperProps={{ disablePortal: true }} >
                <IconButton onClick={() => { this.changeTab(displays.length) }} className={classes.closeIcon} >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              { (order != null) &&
                <Tooltip title="More Options" PopperProps={{ disablePortal: true }} >
                  <IconButton onClick={this.menuOpen} className={classes.moreOptionsIcon} >
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip> }
              <Menu
                anchorEl={anchorElement}
                keepMounted
                open={anchorElement != null}
                onClose={this.menuClose}
                MenuListProps={{
                  style: { padding: 0 }
                }}
              >
                {
                  (menuData != null) ?
                    menuData.map((menu, i) => {
                      return (
                        <span key={i}>
                          <MenuItem key={-1} disabled className={classes.menuItem}><b>{menu.title}</b></MenuItem>
                          <Divider key={-2} />
                          {
                            menu.options.map((option, i) => {
                              return <MenuItem key={i} onClick={() => { option.onClick(); }} className={classes.menuItem}>{option.title}</MenuItem>
                            })
                          }
                          { menu.options.length > 0 && <Divider key={-3} /> }
                          <MenuItem key={-4} onClick={this.menuClose} className={classes.menuItem}>Cancel</MenuItem>
                        </span>
                      )
                    })
                  : null
                }
              </Menu>
              <Typography
                variant="h6"
                component="h1"
                align="center"
                className={classes.title}
              >{currentDisplay?.name}</Typography>
            </Toolbar>
          </Box>
          <Box>
            <IconButton
              onClick={this.toggleTabBar}
              className={classes.dropdownButton}
              style={{ transform: (tabBarState) ? "rotate(180deg)" : "rotate(0)" }}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        </Box>
        <Collapse in={tabBarState} style={{ position: "relative" as "relative" }}>
          <Box display="flex" >
            <Box flexGrow={1}>
              <TabDisplay currentTab={currentTab} />
            </Box>
            <Box hidden={currentDisplay == null}>
              <Divider orientation="vertical" className={classes.divider} />
            </Box>
            <Box>
              <TabBar onSelect={this.changeTab} currentTab={currentTab} />
            </Box>
          </Box>
        </Collapse>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabController);