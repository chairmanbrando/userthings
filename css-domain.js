// ==UserScript==
// @name        Global: CSS Domain/URL Support
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.6.1
// @author      chairmanbrando
// @run-at      document-start
// @description Runs as soon as possible for a web extension to add the page's domain as a class on the `<html>` element.
// ==/UserScript==

let hn = window.location.hostname.split('.');
let su = null; // One subdomain allowed.
let sr = null; // Used for reddit only.

const limit = 3; // (looksLikeCountryTld()) ? 3 : 3;

while (hn.length > limit) {
  hn.shift();
}

if (hn.length === 3) {
  su = hn.shift();
}

hn = hn.join('-');

if (hn === '0-1') {
  hn = 'localhost';
}

// Get the subreddit's name too if relevant.
if (hn === 'reddit-com') {
  sr = window.location.pathname.toLowerCase();
  sr = sr.split('/').filter((p => p.length));

  if (sr.length > 1) {
    sr = `${sr[0]}-slash-${sr[1]}`;
  }
}

// Do the thing!
function addClassToDamnedRootElement() {
  if (su && su !== 'www') {
    document.documentElement.classList.add(su);
  }

  document.documentElement.classList.add(hn);

  if (sr) {
    document.documentElement.classList.add(sr);
  }
}

// @deprecated Regex source: https://redd.it/hzcyp9
function looksLikeCountryTld() {
  const conts = /(\.|^)(ad|ae|af|ag|ai|al|am|ao|ap|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bw|by|bz|ca|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gt|gu|gw|gy|hk|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|si|sk|sl|sm|sn|so|sr|ss|st|sv|sx|sy|sz|tc|td|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)$/;

  return window.location.hostname.match(conts);
}

// Add our handy class as soon as possible...
addClassToDamnedRootElement();

//...but also watch for changes and reapply if necessary. These JS frameworks are out of control!
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.attributeName === 'class') {
      if (! document.documentElement.classList.contains(hn)) {
        addClassToDamnedRootElement();
      }
    }
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  childList: false,
  subtree: false
});
