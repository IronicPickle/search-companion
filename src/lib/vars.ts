import { Settings } from "./interfaces";

export const settingsDefaults: Settings = {
  darkThemeState: false,
  embeddedState: true,
  notificationsState: true,
  extensionState: true,
  embedPosition: { x: 0, y: 0 }
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
  { documentId: "reference", actualId: "reference" },
  { documentId: "reference:", actualId: "reference" },
  { documentId: "application number", actualId: "reference" },
  { documentId: "reference number", actualId: "reference" },

  { documentId: "proposal", actualId: "descripton" },
  { documentId: "description", actualId: "descripton" },
  { documentId: "nature:", actualId: "descripton" },

  { documentId: "address", actualId: "address" },
  { documentId: "address:", actualId: "address" },
  { documentId: "main location", actualId: "address" },
  { documentId: "site address", actualId: "address" },
  { documentId: "development address", actualId: "address" },
  { documentId: "location", actualId: "address" },

  { documentId: "status", actualId: "status" },
  { documentId: "status:", actualId: "status" },

  { documentId: "decision", actualId: "decision" },
  { documentId: "decision:", actualId: "decision" },

  { documentId: "decision issued date", actualId: "decisionIssuedDate" },
  { documentId: "decision made date", actualId: "decisionMadeDate" },
  { documentId: "decision date", actualId: "decisionMadeDate" },
  { documentId: "decision date:", actualId: "decisionMadeDate" },

  { documentId: "application received", actualId: "applicationReceivedDate" },
  { documentId: "application received date", actualId: "applicationReceivedDate" },
  { documentId: "application date", actualId: "applicationReceivedDate" },
  { documentId: "received", actualId: "applicationReceivedDate" },
  { documentId: "key dates", actualId: "applicationReceivedDate" },
  { documentId: "registration date", actualId: "applicationReceivedDate" }
]

export const buildingFields = [
  { documentId: "application reference number", actualId: "reference" },
  { documentId: "case reference", actualId: "reference" },
  { documentId: "building control reference", actualId: "reference" },
  { documentId: "bulding control reference", actualId: "reference" },

  { documentId: "description of works", actualId: "descripton" },
  { documentId: "description", actualId: "descripton" },
  { documentId: "description of work", actualId: "descripton" },
  { documentId: "proposal", actualId: "descripton" },

  { documentId: "site address", actualId: "address" },
  { documentId: "address", actualId: "address" },
  { documentId: "location", actualId: "address" },
  { documentId: "main location", actualId: "address" },
  
  { documentId: "decision", actualId: "decision" },

  { documentId: "decision date", actualId: "decisionDate" },
  
  { documentId: "application date", actualId: "applicationReceivedDate" },
  { documentId: "application received", actualId: "applicationReceivedDate" },
  { documentId: "date received", actualId: "applicationReceivedDate" },
  { documentId: "application received date", actualId: "applicationReceivedDate" },
]

export const monthStringToNumber = [
  { matches: [ "jan" ], number: 0 },
  { matches: [ "feb" ], number: 1 },
  { matches: [ "mar" ], number: 2 },
  { matches: [ "apr" ], number: 3 },
  { matches: [ "may" ], number: 4 },
  { matches: [ "jun" ], number: 5 },
  { matches: [ "jul" ], number: 6 },
  { matches: [ "aug" ], number: 7 },
  { matches: [ "sep" ], number: 8 },
  { matches: [ "oct" ], number: 9 },
  { matches: [ "nov" ], number: 10 },
  { matches: [ "dec" ], number: 11 }
]