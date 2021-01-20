const UNTAPPD_URI_ENDPOINT = 'https://untappd.com/oauth/authenticate/';
const CLIENT_ID = encodeURIComponent(
  '60EA0F09B7ED329F256781F5D96FC29F5F8F15C4'
);
const RESPONSE_TYPE = encodeURIComponent('code');
const REDIRECT_URI = encodeURIComponent(
  'https://ihjjjjkljcndjogahhjgdejlopogagep.chromiumapp.org/beersnob'
);

let _gaq;
_gaq = _gaq || [];
_gaq.push(['_setAccount', 'G-4TWBZ6SHBL']);
_gaq.push(['_trackPageview']);

function create_auth_endpoint(): string {
  const endpointUrl = `${UNTAPPD_URI_ENDPOINT}
?client_id=${CLIENT_ID}
&response_type=${CLIENT_ID}
&redirect_url=${REDIRECT_URI}`;

  return endpointUrl;
}

function extract_access_code(url: string): string {
  const splitUrl = url.split('?');
  const searchString = splitUrl[splitUrl.length - 1];
  const urlParams = new URLSearchParams(searchString);

  return urlParams.get('code');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_auth_endpoint(),
        interactive: true,
      },
      (redirectUri) => {
        if (chrome.runtime.lastError || redirectUri.includes('access_denied')) {
          console.log('could not authenticate');
          sendResponse({ success: false, message: 'authentication failed' });
        } else {
          sendResponse({
            success: true,
            code: extract_access_code(redirectUri),
            message: 'auth successful',
          });
        }
      }
    );
    return true;
  }
});
