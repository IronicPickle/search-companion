import { Settings } from "./interfaces";

export const settingsDefaults: Settings = {
  darkThemeState: false,
  embeddedState: true,
  notificationsState: true,
  extensionState: true
}

export const interfaceCheckInterval = 2500;

export const orderFields = [
  { documentId: "CompanyName", actualId: "companyName", name: "Company Name" },
  { documentId: "FlatNumber", actualId: "flatNumber", name: "Flat Number" },
  { documentId: "PlotNo", actualId: "plotNumber", name: "Plot Number" },
  { documentId: "DevelopmentName", actualId: "developmentName", name: "Development Name" },
  { documentId: "Developer", actualId: "developer", name: "Developer" },
  { documentId: "HouseName", actualId: "houseName", name: "House Name" },
  { documentId: "HouseNumber", actualId: "houseNumber", name: "House Number" },
  { documentId: "Street", actualId: "street", name: "Street" },
  { documentId: "Street2", actualId: "addressLine2", name: "Address Line 2" },
  { documentId: "Street3", actualId: "locality", name: "Locality" },
  { documentId: "AreaTown", actualId: "town", name: "Town" },
  { documentId: "County", actualId: "county", name: "County" },
  { documentId: "PostCode", actualId: "postCode", name: "Post Code" },
  { documentId: "TitleNumber", actualId: "titleNumber", name: "Title Number" },
  { documentId: "UPRN", actualId: "uprn", name: "UPRN" }
]

export const planningFields = [
  { documentId: "Reference", actualId: "reference" },
  { documentId: "Proposal", actualId: "descripton" },
  { documentId: "Address", actualId: "address" },

  { documentId: "Decision", actualId: "decision" },
  { documentId: "Decision Issued Date", actualId: "decisionIssuedDate" },
  { documentId: "Decision Made Date", actualId: "decisionMadeDate" },
  { documentId: "Application Received", actualId: "applicationReceivedDate" },
  { documentId: "Application Received Date", actualId: "applicationReceivedDate" }
]

export const buildingFields = [
  { documentId: "Application Reference Number", actualId: "reference" },
  { documentId: "Description Of Works", actualId: "descripton" },
  { documentId: "Site Address", actualId: "address" },
  
  { documentId: "Decision", actualId: "decision" },
  { documentId: "Decision Date", actualId: "decisionDate" },
  { documentId: "Application Received", actualId: "applicationReceivedDate" }
]