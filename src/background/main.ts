import chromep from "chrome-promise"
import { createNotification } from "../lib/utils";

chrome.runtime.onInstalled.addListener(async function() {

  chrome.storage.local.remove([ "notification" ]);
  //chrome.storage.local.clear();

  chrome.webNavigation.onDOMContentLoaded.addListener(async (navDetails) => {
    if(navDetails.frameId !== 0) return;

    const tabUrl = navDetails.url;

    const filteredInterfaces = interfaces.filter(iface => 
      iface.urls.filter(url => tabUrl.includes(url)).length > 0
    );
    if(filteredInterfaces.length === 0) return;
    const scripts = filteredInterfaces[0].scripts;
    const urls = filteredInterfaces[0].urls;
    const tabs = await chromep.tabs.query({});
    const tabInstances = tabs.filter(tab =>
      urls.filter(url => tab.url?.includes(url)).length > 0
    );

    if(tabInstances.length > 1) {
      console.log("Closing Previous Tabs")
      tabInstances.map(tabInstance => {
        if(tabInstance.id == null) return;
        if(tabInstance.id === navDetails.tabId) return;
        chrome.tabs.remove(tabInstance.id);
      });
      const notification = createNotification({ severity: "warning", text: "This Page is Open Twice" });
      setTimeout(() => chrome.storage.local.set({ notification }), 500);;
    }

    for(const i in scripts) {
      console.log(`Injecting Interfaces: ${scripts[i].toString()}`)
      chrome.tabs.executeScript(navDetails.tabId, {
        file: scripts[i]
      });
    }
  });


});

const interfaces = [
  {
    urls: [ "https://indexcms.co.uk/2.7/case-management" ],
    scripts: [ "js/content/interfaces/cms.js" ]
  }, {
    urls: [ "https://www.terrafirmaidc.co.uk/order/order_report",
      "https://www.terrafirmaidc.co.uk/order" ],
    scripts: [ "js/content/interfaces/terra.js" ]
  }, {
    urls: [ "https://planning.stockport.gov.uk/PlanningData-live/applicationDetails.do",
      "https://planning.stockport.gov.uk/PlanningData-live/buildingControlDetails.do" ],
    scripts: [ "js/content/interfaces/stockport.js" ]
  }
]