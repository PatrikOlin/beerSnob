
const UNTAPPD_URI_ENDPOINT = 'https://untappd.com/oauth/authenticate/';
const CLIENT_ID = encodeURIComponent('60EA0F09B7ED329F256781F5D96FC29F5F8F15C4');
const RESPONSE_TYPE = encodeURIComponent('code');
const REDIRECT_URI = encodeURIComponent('https://pjffaopljddfnmiffhookcockieikddm.chromiumapp.org/untappdbolaget')
const REDIRECT_EXTRACTION = new RegExp(REDIRECT_URI + '[#\?](.*)');

let user_signed_in = false;


function create_auth_endpoint() {
  let endpoint_url = `${UNTAPPD_URI_ENDPOINT}
?client_id=${CLIENT_ID}
&response_type=${CLIENT_ID}
&redirect_url=${REDIRECT_URI}`;

  return endpoint_url;
}

function extract_access_token(url) {
  const splitUrl = url.split('?');
  const searchString = splitUrl[splitUrl.length - 1];
  const urlParams = new URLSearchParams(searchString);

  return urlParams.get('code');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    chrome.identity.launchWebAuthFlow({
      url: create_auth_endpoint(),
      interactive: true,
    }, function (redirect_uri) {
      console.log(create_auth_endpoint())
      if (chrome.runtime.lastError || redirect_uri.includes('access_denied')) {
        console.log('could not authenticate');
        sendResponse('auth failed');
      } else {
        user_signed_in = true;
        console.log('redirect_uri', redirect_uri)
        chrome.storage.local.set({accessToken: extract_access_token(redirect_uri)}, function() {
          console.log('token set in storage')
        });
        chrome.storage.local.set({signedIn: true}, function() {
          console.log('signedIn set in storage')
        });
        chrome.storage.local.get(['accessToken'], function(result) {
          console.log('accessToken is', result);
        });
        console.log()
        console.log('auth successful');
        sendResponse('auth success');
      }
    });
    return true;
  }
})

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
