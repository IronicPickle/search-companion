import { Context, createContext } from "react";
import { Building, Notification, Order, Planning, Settings } from "../lib/interfaces";

export interface GlobalContext {
  order?: Order;
  settings: Settings;
  planning?: Planning;
  building?: Building;
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