import { Context, createContext } from "react";
import { Building, KanbanOrder, Notification, Order, OrderHistory, Planning, Settings } from "../lib/interfaces";
import { settingsDefaults } from "../lib/vars"

export interface GlobalContext {
  order?: Order;
  settings: Settings;
  planning?: Planning;
  building?: Building;
  notification?: Notification;
  sendNotification?: (settings: Notification) => any;
  orderHistory?: OrderHistory;
  kanbanOrder?: KanbanOrder;
}

export const globalContextDefaults: GlobalContext = {
  settings: settingsDefaults
}

export const globalContext: Context<GlobalContext> = createContext(globalContextDefaults);