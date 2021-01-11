import { createMuiTheme, Theme, ThemeOptions } from "@material-ui/core";

const shared:ThemeOptions = {
  zIndex: {
    mobileStepper: 2000000,
    speedDial: 3000000,
    appBar: 4000000,
    drawer: 5000000,
    modal: 6000000,
    snackbar: 7000000,
    tooltip: 8000000
  }
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