// ==UserScript==
// @name        Redirect RTD to Archive.is
// @namespace   Violentmonkey Scripts
// @match       https://richmond.com/*.html
// @grant       none
// @run-at      document-idle
// @version     1.1
// @author      chairmanbrando
// @description RTD doesn't want anyone but rich folks to read their articles. 🤷‍♀️
// ==/UserScript==

function setIntervalWithLimit(callback, delay, repeats)
{
  let runs = 1;

  const iv = setInterval(() => {
    callback();

    if (runs === repeats) {
      clearInterval(iv);
    }

    ++runs;
  }, delay);
}

// If paywall stuff doesn't pop after three seconds it's likely not coming.
setIntervalWithLimit(() => {
  if (document.querySelector('#access-offers-modal .modal.in')) {
    location.href = 'https://archive.is/' + location.href;
  }
}, 500, 6);
