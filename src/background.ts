chrome.runtime.onInstalled.addListener(() => {
  chrome.webNavigation.onCompleted.addListener(
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
        chrome.pageAction.show(id);
      });
    },
    { url: [{ urlMatches: 'systembolaget.se' }] }
  );
});

// fetch("https://api.fejk.company/v1/companies").then(r => r.text()).then(result => {
//   console.log(result)
// })
