import chromep from "chrome-promise"

chrome.runtime.onInstalled.addListener(async function() {

  await chromep.storage.sync.clear();

  setInterval(async () => {
    console.log(
      await chromep.storage.sync.get()
    )
  }, 500);

});