// Icon imports
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SearchIcon from "@material-ui/icons/Search";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Box, Collapse, Divider, Grid, IconButton, TextField, Menu, MenuItem, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import TabDisplay, { displays } from "./TabDisplay";
import TabBar from "./TabBar";
import { kanbanGetMenuData, kanbanInsertProducts, kanbanInsertSearch } from "../../lib/kanban";
import { formToDuct, FormType } from "../../lib/form";
import { getShortcodesMenuData, ShortcodeType } from "../../lib/shortcodes";

const styles = (theme: Theme) => ({
  header: {
    minHeight: theme.spacing(6),
    marginRight: theme.spacing(2) + 1
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
    float: "left" as "left"
  },
  moreOptionsIcon: {
    float: "right" as "right"
  },
  gotoIcon: {
    float: "right" as "right"
  },
  gotoField: {
    padding: theme.spacing(1)
  },

  menuTitle: {
    fontWeight: 600
  },
  menuItem: {
    minHeight: 0
  },

  displayContainer: {
    height: 370
  }
});

interface Props {
  classes: ClassNameMap
}

interface State {
  currentTab: number;
  tabBarState: boolean;
  moreAnchorElement: HTMLElement | null;
  gotoAnchorElement: HTMLElement | null;
  menuData?: MenuData[];
  gotoReference: string;
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
      moreAnchorElement: null,
      gotoAnchorElement: null,
      gotoReference: ""
    }
    
    this.gotoMenuOpen = this.gotoMenuOpen.bind(this);
    this.gotoMenuClose = this.gotoMenuClose.bind(this);
    this.gotoSearch = this.gotoSearch.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.toggleTabBar = this.toggleTabBar.bind(this);
    this.moreMenuOpen = this.moreMenuOpen.bind(this);
    this.moreMenuClose = this.moreMenuClose.bind(this);
  }

  moreMenuOpen(event: MouseEvent<HTMLButtonElement>) {
    const menuData: MenuData[] = [];
    const kanbanActive = window.location.href.includes("https://kanbanflow.com/board");

    const shortcodeMenuOptions = [
      "Address (Single Line)", "Address (Multi Line)", "Other"
    ]
    
    menuData.push(
      { title: "Shortcodes", options: [
        ...shortcodeMenuOptions.map(option => {
          return { title: option, onClick: () => {
            this.setState({
              menuData: getShortcodesMenuData(option as ShortcodeType, () => 
                this.moreMenuClose()
              )
            });
          }}
        })
      ]}
    );

    const formMenuOptions = [
      "LLC1", "Con29R", "Con29O"
    ]

    menuData.push(
      { title: "Generate Forms", options: [
        ...formMenuOptions.map(option => {
          return { title: option, onClick: () => {
            formToDuct(option.toLowerCase() as FormType); this.moreMenuClose();
          } }
        })
      ] }
    )

    if(kanbanActive) {
      menuData.push(
        { title: "KanBan Options", options: [
          { title: "Insert Search", onClick: () => {
            this.setState({
              menuData: kanbanGetMenuData((id: string) => {
                kanbanInsertSearch(id); this.moreMenuClose();
              })
            });
          }}, { title: "Insert Products", onClick: () => {
            this.setState({
              menuData: kanbanGetMenuData((id: string) => {
                kanbanInsertProducts(id); this.moreMenuClose();
              })
            });
          }}
        ] }
      )
    }

    if(menuData.length === 0) menuData.push({ title: "No Options Available", options: [] } );
    this.setState({ moreAnchorElement: event.currentTarget, menuData: menuData });
  }
  
  moreMenuClose() {
    this.setState({ moreAnchorElement: null });
    window.postMessage("closePopover", "*");
  }

  gotoMenuOpen(event: MouseEvent<HTMLButtonElement>) {
    this.setState({ gotoAnchorElement: event.currentTarget, gotoReference: "" });
  }
  
  gotoMenuClose() {
    this.setState({ gotoAnchorElement: null });
    window.postMessage("closePopover", "*");
  }

  gotoSearch(event: React.FormEvent<HTMLFormElement>) {
    event.stopPropagation();
    event.preventDefault();
    const { gotoReference } = this.state;
    window.open(`https://indexcms.co.uk/2.8/case-management?goto=${gotoReference}`);
    this.gotoMenuClose();
  }

  changeTab(index: number) {
    this.setState({ tabBarState: true, currentTab: index });
  }

  toggleTabBar(event: MouseEvent<HTMLButtonElement>) {
    this.setState({ tabBarState: !this.state.tabBarState, currentTab: displays.length });
  }

  componentDidMount() {
    chrome.storage.onChanged.addListener(async (changes) => {
      const { settings } = this.context;
      if(changes.notification != null) {

        const notification = changes.notification.newValue;
        if(notification.href !== window.location.href) return;

        const tabOverride = notification.tabOverride;
        if(tabOverride == null) return;

        if(settings.notificationsState && settings.extensionState) this.changeTab(tabOverride);
      }
    });

    this.context.openTab = this.changeTab;
  }

  render() {
    const { classes } = this.props;
    const { currentTab, tabBarState, menuData, moreAnchorElement, gotoAnchorElement, gotoReference } = this.state;
    const { order } = this.context as GlobalContext;

    if(order?.council) {
      let council = order?.council.replace(/ /g, "");
      if(council.includes("(")) council = council.slice(0, council.indexOf("("));
    }

    const currentDisplay = displays[currentTab];

    return (
      <>
        <Box display="flex">
          <Box flexGrow={1} hidden={currentDisplay == null}>
            <Toolbar disableGutters={true} className={classes.header} hidden={currentDisplay == null} >
              <Grid container justify="flex-start">
                <Tooltip title="Close" PopperProps={{ disablePortal: true }} >
                  <IconButton onClick={() => { this.changeTab(displays.length) }} className={classes.closeIcon} >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container justify="center">
                <Typography
                  variant="h6"
                    component="h1"
                    align="center"
                    className={classes.title}
                  >{currentDisplay?.name}</Typography>
              </Grid>
              <Grid container justify="flex-end">
                <Toolbar disableGutters={true} style={{ minWidth: 0 }} >
                  { (order != null) &&
                    <Tooltip title="More Options" PopperProps={{ disablePortal: true }} >
                      <IconButton onClick={this.moreMenuOpen} className={classes.moreOptionsIcon} >
                        <MoreHorizIcon />
                      </IconButton>
                    </Tooltip> }
                    <Tooltip title="Goto Search" PopperProps={{ disablePortal: true }} >
                      <IconButton onClick={this.gotoMenuOpen} className={classes.gotoIcon} >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </Toolbar>
                </Grid>
              </Toolbar>
              <Menu
                anchorEl={gotoAnchorElement}
                keepMounted
                open={gotoAnchorElement != null}
                onClose={this.gotoMenuClose}
                MenuListProps={{
                  style: { padding: 0 }
                }}
              >
                <form onSubmit={this.gotoSearch}>
                  <TextField
                    autoFocus
                    placeholder="Order Reference"
                    value={gotoReference}
                    onChange={event => this.setState({ gotoReference: event.target.value })}
                    className={classes.gotoField}
                  />
                </form>
              </Menu>
              <Menu
                anchorEl={moreAnchorElement}
                keepMounted
                open={moreAnchorElement != null}
                onClose={this.moreMenuClose}
                MenuListProps={{
                  style: { padding: 0 }
                }}
              >
                { menuData != null &&
                  menuData.map((menu, i) => {
                    return (
                      <span key={i}>
                        <MenuItem key={-1} disabled className={classes.menuTitle}>{menu.title}</MenuItem>
                        <Divider />
                        {
                          menu.options.map((option, i) => {
                            return <MenuItem key={i} onClick={() => { option.onClick(); }} className={classes.menuItem}>{option.title}</MenuItem>
                          })
                        }
                        { menu.options.length > 0 && <Divider /> }
                      </span>
                    )
                  }) }
                <MenuItem key={-2} onClick={this.moreMenuClose} className={classes.menuItem}><b>Cancel</b></MenuItem>
              </Menu>
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
            <Box flexGrow={1} className={classes.displayContainer}>
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