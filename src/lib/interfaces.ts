export interface Storage {
  [key: string]: any;
  order?: Order;
  settings: Settings;
  notification?: Notification;
  planning?: Planning;
  building?: Building;
  orderHistory?: OrderHistory;
  kanbanOrder?: KanbanOrder;
}

export interface Property {
  [key: string]: any;
  companyName: string;
  flatNumber: string;
  plotNumber: string;
  developmentName: string;
  developer: string;
  houseName: string;
  houseNumber: string;
  street: string;
  addressLine2: string;
  locality: string;
  town: string;
  county: string;
  postCode: string;
  titleNumber: string;
  uprn: string;
}

export interface Product {
  [key: string]: any;
  name: string;
  returned?: string;
  cost: string;
}

export interface Location {
  [key: string]: any;
  northing: string;
  easting: string;
}

export interface Order {
  [key: string]: any;
  reference: string;
  property: Property;
  products: Product[];
  location: Location;
  type: string;
  council: string;
  water: string;
  totalCost: string;
}

export type OrderHistory = (Order & { lastViewed: number; })[]

export interface KanbanOrder {
  [key: string]: any;
  reference: string;
  date: string;
  details: string;
}

export interface Planning {
  [key: string]: any;
  reference?: string;
  descripton?: string;
  address?: string;
  status?: string;
  decision?: string;
  decisionIssuedDate?: number | string;
  decisionMadeDate?: number | string;
  applicationReceivedDate?: number | string;
}

export interface Building {
  [key: string]: any;
  reference?: string;
  descripton?: string;
  address?: string;
  decision?: string;
  decisionDate?: number | string;
  applicationReceivedDate?: number | string;
}




export interface NotificationSettings {
  [key: string]: any;
  severity: "success" | "info" | "warning" | "error" | undefined;
  text: string;
}

export interface Notification {
  [key: string]: any;
  settings: NotificationSettings;
  tabOverride?: number;
  created: number;
  href: string;
}

export interface Settings {
  [key: string]: any;
  embeddedState: boolean;
  darkThemeState: boolean;
  notificationsState: boolean;
  extensionState: boolean;
  embedPosition: { x: number, y: number }
}

export interface InterfaceInfo {
  [key: string]: any;
  urls: string[];
  scripts: string[];
  restrictToOneTab: boolean;
}