chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("i contentscript");
  console.log(
    sender.tab ? "from content script: " + sender.tab.url : "from extension"
  );
  if (request.extractFromPage === "hopt") {
    let name = null;
    let brewery = null;
    const nameList = document.querySelectorAll('h1[class*="styled__Title"]');
    const breweryList = document.querySelectorAll(
      'h2[class*="styled__Manufacturer"]'
    );
    if (nameList.length > 0) {
      name = nameList[0].innerText;
    }
    if (breweryList.length > 0) {
      brewery = breweryList[0].innerText;
    }
    console.log("name brew", name, brewery);
    sendResponse({ name, brewery });
  }
  if (request.extractFromPage === "glasbanken") {
    let name = null;
    let brewery = null;
    const nameList = document.querySelectorAll('h1[class*="styled__Title"]');
    const breweryList = document.querySelectorAll(
      'h2[class*="styled__Manufacturer"]'
    );
    if (nameList.length > 0) {
      name = nameList[0].innerText;
    }
    if (breweryList.length > 0) {
      brewery = breweryList[0].innerText;
    }
    sendResponse({ name, brewery });
  }
  sendResponse({ error: "NO MATCH" });
});

// chrome.runtime.onConnect.addListener((port) => {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener((msg) => {
//     port.postMessage({
//       respo: "Jag är fast i ett content script och kan inte komma loss",
//     });
//   });
// });

// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((msg) => {
//     console.log('msssgg', msg)
//   if (msg.hopt === 'dom') {
//     const name = document.querySelectorAll('[class*="styled__Title"]');
//     const brewery = document.querySelectorAll('[class*="styled__Manufacturer"]');
//     port.postMessage({ name: JSON.stringify(name), brewery: JSON.stringify(brewery) })
//   }
//   })
// });
