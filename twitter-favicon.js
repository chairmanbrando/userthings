// ==UserScript==
// @name        Twitter: Bird Favicon
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.1
// @author      chairmanbrando
// @description Replaces the stupid 𝕏 favicon, which is nigh unrecognizable in a
//              list of tabs, with the old blue bird guy. Oh, and now it also 
//              changes "X" to "Twitter" in tab titles.
// ==/UserScript==

let favicon = document.querySelector('link[rel="shortcut icon"]');

if (favicon) {
  favicon.href = 'https://abs.twimg.com/favicons/twitter.ico';
}

setInterval(() => {
  let title = document.querySelector('title');

  if (title && title.textContent.includes('X')) {
    let reXTitle = / \/ X$/;

    if (reXTitle.test(title.textContent)) {
      title.textContent = title.textContent.replace(reXTitle, ' / Twitter');
    }
  }
}, 250);
