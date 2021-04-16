import { InterfaceInfo, Settings } from "./interfaces";

export const settingsDefaults: Settings = {
  darkThemeState: false,
  embeddedState: true,
  notificationsState: true,
  extensionState: true,
  embedPosition: { x: 0, y: 0 }
}

export const interfaceCheckInterval = 2500;

export const cmsVersion = "2.8";

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

export const interfaces: InterfaceInfo[] = [
  {
    urls: [ "https://indexcms.co.uk/2.7/case-management",
      "https://indexcms.co.uk/2.7/franchiseemenu.php",
      "https://indexcms.co.uk/2.8/case-management",
      "https://indexcms.co.uk/2.8/franchiseemenu.php"
    ],
    scripts: [ "js/content/interfaces/CMS.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://kanbanflow.com/board/" ],
    scripts: [ "js/content/interfaces/KanBan.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://www.terrafirmaidc.co.uk/order/order_report",
      "https://www.terrafirmaidc.co.uk/order",
      "https://www.terrafirmaidc.co.uk/order/render_order_anc"
    ],
    scripts: [ "js/content/interfaces/Terra.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://www.groundstability.com/public/web/web-portal/log-order?execution" ],
    scripts: [ "js/content/interfaces/CoalAuthority.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://www.utilitysearch.com/PostcodeServiceChecker.asp",
      "https://www.utilitysearch.com/DraftRequest.asp"
    ],
    scripts: [ "js/content/interfaces/UtilitySearch.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://propertysearches.unitedutilities.com/homeloggedin/order/" ],
    scripts: [ "js/content/interfaces/UnitedUtilities.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "/applicationDetails.do",
      "/appealDetails.do",
      "/buildingControlDetails.do",
      "/simpleSearchResults.do",
      "/shortUrlResults.do?action=firstPage&searchType=Application",
      "/caseDetails.do"
    ],
    scripts: [ "js/content/interfaces/SimpleSearch.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://forms.fensa.org.uk/fensa-certificate" ],
    scripts: [ "js/content/interfaces/Fensa.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://public.tameside.gov.uk/forms/f513buildregcomp385.asp" ],
    scripts: [ "js/content/interfaces/Tameside.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://planning.warrington.gov.uk/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl",
      "https://planning.warrington.gov.uk/swiftlg/apas/run/WBHAPPDETAIL.DisplayUrl"
    ],
    scripts: [ "js/content/interfaces/Warrington.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://planning.blackburn.gov.uk/Northgate/PlanningExplorer/Generic/StdDetails.aspx" ],
    scripts: [ "js/content/interfaces/Blackburn.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://www.ribblevalley.gov.uk/planningApplication/",
      "http://5.61.123.171/Northgate/BC/BCExplorer/BC/ApplicationDetails.aspx"
  ],
    scripts: [ "js/content/interfaces/RibbleValley.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://selfservice.preston.gov.uk/service/planning/ApplicationView.aspx" ],
    scripts: [ "js/content/interfaces/Preston.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://planning.cheshireeast.gov.uk/applicationdetails.aspx",
      "https://planning.cheshireeast.gov.uk/applicationdetailsBC.aspx",
      "http://planning.cheshireeast.gov.uk/applicationdetails.aspx",
      "http://planning.cheshireeast.gov.uk/applicationdetailsBC.aspx"
    ],
    scripts: [ "js/content/interfaces/CheshireEast.js" ],
    restrictToOneTab: false
  }
]