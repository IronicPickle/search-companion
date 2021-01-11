import { Context, createContext } from "react";
import { Notification, Order, Settings } from "../lib/interfaces";

export interface GlobalContext {
  order?: Order;
  settings: Settings;
  notification?: Notification;
  sendNotification?: (settings: Notification) => any;
}

export const globalContextDefaults: GlobalContext = {
  settings: {
    darkThemeState: false,
    embeddedState: true
  }
}

export const globalContext: Context<GlobalContext> = createContext(globalContextDefaults);