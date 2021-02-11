// Icon imports
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Box, Collapse, Dialog, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Slide, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import TabDisplay, { displays } from "./TabDisplay";
import TabBar from "./TabBar";

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
  }
});

interface Props {
  classes: ClassNameMap
}

interface State {
  currentTab: number;
  tabBarState: boolean;
  anchorElement: HTMLElement | null;
  menuData?: MenuData;
}

interface MenuData {
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
    this.kanbanInsertSearch = this.kanbanInsertSearch.bind(this);
    this.kanbanInsertProducts = this.kanbanInsertProducts.bind(this);
  }
  
  menuClose() {
    this.setState({ anchorElement: null });
    window.postMessage("closePopover", "*");
  }

  menuOpen(event: MouseEvent<HTMLButtonElement>) {
    const menuData: MenuData = { title: "KanBan Options", options: [
      { title: "Insert Search", onClick: () => this.setState({
        menuData: this.kanbanGetMenuData(this.kanbanInsertSearch)
      }) },
      { title: "Insert Products", onClick: () => this.setState({
        menuData: this.kanbanGetMenuData(this.kanbanInsertProducts)
      }) }
    ] }
    this.setState({ anchorElement: event.currentTarget, menuData });
  }

  kanbanGetMenuData(onClickFunction: (id: string) => any) {
    const columnHeaders = Array.from(document.getElementsByClassName("columnHeader"));
    const menuData: MenuData = { title: "Select a Column", options: [] };

    for(const i in columnHeaders) {
      const columnHeader = columnHeaders[i];

      const id = columnHeader.getAttribute("data-columnid");
      const title = columnHeader.getElementsByTagName("h2").item(0)?.innerText;
      if(id == null || title == null) continue;

      menuData.options.push({ title, onClick: () => { onClickFunction(id); } })

    }

    return menuData;
    
  }
  
  kanbanInsertSearch(id: string) {
    this.menuClose();

    const products = (this.context as GlobalContext).order?.products;
    if(products == null) return;
    products.filter(product => product.name.includes("Index Regulated Drainage & Water Report"))
    
    const columnHeaders = Array.from(document.getElementsByClassName("columnHeader"));
    const columnTaskLists = Array.from(document.getElementsByClassName("board-taskListCell"));

    const columnHeader = columnHeaders.find(columnHeader => columnHeader.getAttribute("data-columnid") === id);
    const columnTaskList = columnTaskLists.find(columnTaskList => columnTaskList.getAttribute("data-columnid") === id);

    if(columnHeader == null || columnTaskList == null) return;

    const addTaskButton = columnHeader.getElementsByClassName("columnHeader-addTask").item(0) as HTMLButtonElement | null;
    if(addTaskButton == null) return;
    addTaskButton.click();

    const taskNameTextArea = document.getElementsByClassName("addTaskDialog-name").item(0) as HTMLTextAreaElement | null;
    if(taskNameTextArea == null) return;
    taskNameTextArea.value = "test";
    taskNameTextArea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));

    const addLabelButton = document.getElementsByClassName("addTaskDialog-iconButton").item(1) as HTMLButtonElement | null;
    if(addLabelButton == null) return;
    addLabelButton.click();
    
    const labelNameTextArea = document.getElementsByClassName("taskLabelInput-input").item(0) as HTMLTextAreaElement | null;
    if(labelNameTextArea == null) return;
    labelNameTextArea.value = "test";
    labelNameTextArea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    labelNameTextArea.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter", code: "Enter"
    }))

    const closeLabelButton = document.getElementsByClassName("popoverDialog-close").item(0) as HTMLButtonElement | null;
    if(closeLabelButton == null) return;
    closeLabelButton.click();
    
    const closeTaskButton = document.getElementsByClassName("addTaskDialog-button").item(2) as HTMLButtonElement | null;
    if(closeTaskButton == null) return;
    closeTaskButton.click();

  }

  kanbanInsertProducts(id: string) {
    console.log(id)
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

    const kanbanActive = window.location.href.includes("https://kanbanflow.com/board");

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
              <Tooltip title="More Options" PopperProps={{ disablePortal: true }} >
                <IconButton onClick={this.menuOpen} className={classes.moreOptionsIcon} >
                  <MoreHorizIcon />
                </IconButton>
              </Tooltip>
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
                    <span>
                      <MenuItem key={-1} disabled><b>{menuData.title}</b></MenuItem>
                      <Divider key={-2} />
                      {
                        menuData.options.map((option, i) => {
                          return <MenuItem key={i} onClick={() => { option.onClick(); }}>{option.title}</MenuItem>
                        })
                      }
                      <Divider key={-3} />
                      <MenuItem key={-4} onClick={this.menuClose}>Cancel</MenuItem>
                    </span>
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
        <Collapse in={tabBarState}>
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