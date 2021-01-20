import chromep from "chrome-promise"
import { InterfaceInfo, Order, OrderHistory, Storage } from "../lib/interfaces";
import { createNotification } from "../lib/utils";
import { settingsDefaults } from "../lib/vars";

chrome.runtime.onConnect.addListener(() => start());
chrome.runtime.onStartup.addListener(() => start());
chrome.runtime.onInstalled.addListener(() => start());

export async function resetSettings() {

  await chromep.storage.local.set({ settings: settingsDefaults });

}

export async function clearCurrentOrder() {

  await chromep.storage.local.remove([ "order", "planning", "building", "orderHistory" ]);

}

function closeOtherTabs(tabs: chrome.tabs.Tab[], exemptTabs: chrome.tabs.Tab[]) {
  console.log("Closing Previous Tabs")
  tabs.map(tab => {
    if(tab.id == null) return;
    const isExempt = exemptTabs.filter(exemptTab => exemptTab.id === tab.id).length > 0;
    if(isExempt) return;
    chrome.tabs.remove(tab.id);
  });
}

async function start() {

  console.log("Extension Started - Listening for Interface Compatible URLs");

  chrome.storage.onChanged.addListener(changes => storageChange(changes));

  chrome.storage.local.remove([ "notification" ]);

  const storage = <Storage> await chromep.storage.local.get();
  if(storage.settings == null) resetSettings();


  chrome.webNavigation.onDOMContentLoaded.addListener(async (navDetails) => {
    const storage = <Storage> await chromep.storage.local.get();
    if(navDetails.frameId !== 0) return;

    if(!storage.settings?.extensionState) return;
    
    const currentTab = await chromep.tabs.get(navDetails.tabId);
    const currnetInterface = interfaces.filter(filteredInterface => 
      filteredInterface.urls.filter((url: string) => navDetails.url.includes(url)).length > 0
    )[0];

    if(currnetInterface == null) return;
    const interfaceScripts = currnetInterface.scripts;
    const interfaceUrls = currnetInterface.urls;
    const interfaceSingleTab = currnetInterface.restrictToOneTab;

    
    const tabs = await chromep.tabs.query({});
    const tabsRunningInterface = tabs.filter(tab =>
      interfaceUrls.filter((interfaceUrl: string) => tab.url?.includes(interfaceUrl)).length > 0
    );

    if(tabsRunningInterface.length > 1 && interfaceSingleTab) {
      closeOtherTabs(tabsRunningInterface, [ currentTab ]);
      
      const notification = createNotification(
        { severity: "error", text: "Only One Instance of Tab Allowed" }, 0, currentTab.url
      );
      setTimeout(() => chrome.storage.local.set({ notification }), 500);
    }

    for(const i in interfaceScripts) {
      console.log(`Injecting Interfaces: ${interfaceScripts[i].toString()}`)
      chrome.tabs.executeScript(navDetails.tabId, {
        file: interfaceScripts[i]
      });
    }
  });

}

async function storageChange(changes: { [key: string]: chrome.storage.StorageChange }) {

  const storage = <Storage> await chromep.storage.local.get();
  let orderHistory = storage.orderHistory || [];

  const newOrder = <Order> changes.order?.newValue;
  if(newOrder == null) return;

  for(const i in orderHistory) {
    if(orderHistory[i].reference === newOrder.reference) {
      orderHistory.splice(parseInt(i), 1);
      break;
    }
  }

  orderHistory.unshift({ ...newOrder, lastViewed: new Date().getTime() });
  orderHistory = orderHistory.slice(0, 10);

  chrome.storage.local.set({ orderHistory });
  
}

const interfaces: InterfaceInfo[] = [
  {
    urls: [ "https://indexcms.co.uk/2.7/case-management",
      "https://indexcms.co.uk/2.7/franchiseemenu.php"
    ],
    scripts: [ "js/content/interfaces/cms.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://kanbanflow.com/board/" ],
    scripts: [ "js/content/interfaces/kanban.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://www.terrafirmaidc.co.uk/order/order_report",
      "https://www.terrafirmaidc.co.uk/order",
      "https://www.terrafirmaidc.co.uk/order/render_order_anc"
    ],
    scripts: [ "js/content/interfaces/terra.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://www.groundstability.com/public/web/web-portal/log-order?execution" ],
    scripts: [ "js/content/interfaces/coalAuthority.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://propertysearches.unitedutilities.com/homeloggedin/order/" ],
    scripts: [ "js/content/interfaces/unitedUtilities.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "/applicationDetails.do",
      "/buildingControlDetails.do",
      "/simpleSearchResults.do",
      "/shortUrlResults.do?action=firstPage&searchType=Application",
      "/caseDetails.do"
    ],
    scripts: [ "js/content/interfaces/simpleSearch.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://public.tameside.gov.uk/forms/f513buildregcomp385.asp" ],
    scripts: [ "js/content/interfaces/tameside.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://planning.warrington.gov.uk/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl",
      "https://planning.warrington.gov.uk/swiftlg/apas/run/WBHAPPDETAIL.DisplayUrl"
    ],
    scripts: [ "js/content/interfaces/warrington.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://planning.blackburn.gov.uk/Northgate/PlanningExplorer/Generic/StdDetails.aspx" ],
    scripts: [ "js/content/interfaces/blackburn.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://www.ribblevalley.gov.uk/planningApplication/",
      "http://5.61.123.171/Northgate/BC/BCExplorer/BC/ApplicationDetails.aspx"
  ],
    scripts: [ "js/content/interfaces/ribbleValley.js" ],
    restrictToOneTab: false
  }, {
    urls: [ "https://selfservice.preston.gov.uk/service/planning/ApplicationView.aspx" ],
    scripts: [ "js/content/interfaces/preston.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://planning.cheshireeast.gov.uk/applicationdetails.aspx",
      "https://planning.cheshireeast.gov.uk/applicationdetailsBC.aspx",
      "http://planning.cheshireeast.gov.uk/applicationdetails.aspx",
      "http://planning.cheshireeast.gov.uk/applicationdetailsBC.aspx"
    ],
    scripts: [ "js/content/interfaces/cheshireEast.js" ],
    restrictToOneTab: false
  }, {
    urls: [
      "https://www.utilitysearch.com/PostcodeServiceChecker.asp",
      "https://www.utilitysearch.com/DraftRequest.asp"
    ],
    scripts: [ "js/content/interfaces/utilitySearch.js" ],
    restrictToOneTab: false
  }
]