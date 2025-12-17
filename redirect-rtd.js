// ==UserScript==
// @name        Redirect RTD to Archive.is
// @namespace   Violentmonkey Scripts
// @match       https://richmond.com/*.html
// @grant       none
// @run-at      document-idle
// @version     1.0
// @author      chairmanbrando
// @description RTD doesn't want anyone but rich folks to read their articles. 🤷‍♀️
// ==/UserScript==

setTimeout(() => {
  if (document.querySelector('#access-offers-modal .modal.in')) {
    location.href = 'https://archive.is/' + location.href;
  }
}, 1000);
