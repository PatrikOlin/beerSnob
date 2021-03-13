chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

    sendResponse({ name, brewery });
  }
  if (request.extractFromPage === "glasbanken") {
    let name = null;
    let brewery = null;
    const titleList = document.querySelectorAll(
      'h1[class="product-title product_title entry-title"]'
    );

    if (titleList.length > 0) {
      title = titleList[0].innerText.split("–");
      brewery = title[0];
      name = title[1];
    }

    sendResponse({ name, brewery });
  }
  if (request.extractFromPage === "systembolaget") {
    let name = null;
    let brewery = null;
    let h1List = document.getElementById("mainContent").querySelectorAll("h1");
    let h1 = h1List[h1List.length - 1];
    let parts = h1.innerText.replace(/\r/g, "").split(/\n/);

    name = parts[1];
    brewery = parts[0];

    sendResponse({ name, brewery });
  }
  if (request.extractFromPage === "hoptimaal") {
    let name = null;
    let brewery = null;
    let header = document.querySelectorAll("header.title");
    let parts = header[0].innerText.replace(/\r/g, "").split(/\n/);
    name = parts[0];
    brewery = parts[parts.length - 1].replace("Brand: ", "");
    name = name.replace(brewery, "");

    sendResponse({ name, brewery });
  }

  sendResponse({ error: "NO MATCH" });
});
