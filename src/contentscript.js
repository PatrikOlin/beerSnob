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
    const xpath = "//h4[text()='Producent']";
    const siblingElement = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    brewery = siblingElement.nextSibling.firstChild.innerText;
    const parentElement = document.querySelectorAll(
      'h1[class="css-px3mal"]'
    )[0];
    name = parentElement.lastChild.innerText;

    sendResponse({ name, brewery });
  }
  sendResponse({ error: "NO MATCH" });
});
