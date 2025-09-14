// ==UserScript==
// @name        Twitter: Bird Favicon
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Replaces the stupid 𝕏 favicon, which is nigh unrecognizable in a
//              list of tabs, with the old blue bird guy.
// ==/UserScript==

let favicon = document.querySelector('link[rel="shortcut icon"]');

if (favicon) {
  favicon.href = 'https://abs.twimg.com/favicons/twitter.ico';
}
