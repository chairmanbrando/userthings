// ==UserScript==
// @name        Google Search Deshittifier
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search*
// @grant       none
// @run-at      document-start
// @version     1.1
// @author      chairmanbrando
// @description Google has a version of their search available sans AI and their so-called "knowledge panels" but you have to work for it. Or do you?
// ==/UserScript==

// There may be more disqualifiers for which you wouldn't want to redirect. I'll
// add to them the list as they come up.
if (
  window.location.href.indexOf('udm=') === -1 &&
  window.location.href.indexOf('tbs=') === -1 &&
  window.location.href.indexOf('source=lnms' === -1)
) {
  window.location.href = window.location.href + '&udm=14';
}

// Makes it so you can click the "All" link in case you want to see what the AI
// and/or info boxes are for your current search.
document.addEventListener('DOMContentLoaded', (e) => {
  // This "should" be the "All" link, but I suppose it's not guaranteed.
  const first = document.querySelector('a[href^="/search"][role="link"]');

  first.setAttribute('href', first.getAttribute('href') + '&udm=0');
});
