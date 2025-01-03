// ==UserScript==
// @name        Easier Wiki Searching
// @namespace   Violentmonkey Scripts
// @match       *://*/wiki/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Scrolling up to the top of wiki pages can be annoying given their length. Hit `/` to jump right to the search input! Yes, this could be applied to all sites with `input[type="search"]` on them, but let's take it one step at a time.
// ==/UserScript==

const input = document.querySelector('input[type="search"]');
  let chain = false;

if (!input) return;

// `keydown` with a `focus()` call is needed to override Firefox's "quick find"
// functionality, but that means the "/" you type ends up in the input...
document.body.addEventListener('keydown', (e) => {
    if (e.target !== document.body) return;

    if (e.key === '/') {
        input.focus();
        chain = true;
    }
});

// ...Thus, we have to clear it out. This "should" be fast enough to prevent
// any automatic XHR searching for "/".
input.addEventListener('input', (e) => {
    if (chain) {
        input.value = '';
        chain = false;
    }
});
