import { createMuiTheme, Theme, ThemeOptions } from "@material-ui/core";

const shared:ThemeOptions = {
}

export const lightTheme: Theme = createMuiTheme({
  palette: {
    type: "light"
  }
}, shared);

export const darkTheme: Theme = createMuiTheme({
  palette: {
    type: "dark"
  }
}, shared);