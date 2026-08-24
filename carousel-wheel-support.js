// ==UserScript==
// @name        Cycle Carousels with Wheel
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @match       https://www.imdb.com/*
// @match       https://*.wikipedia.org/wiki/*
// @grant       none
// @version     1.1.3
// @author      chairmanbrando
// @description Add a `@match` directive each time you find yourself on a site
//              you use a lot and would be better with carousel scrolling. Some
//              carousel libraries do this as part of their features, but sadly
//              some do not. If those non-supporting libraries supposed going
//              forward/back with arrow keys, this'll attach the wheel to 'em.
// ==/UserScript==

function maybeSendArrowKeyInstead(e, selector) {
  if (! Array.from(document.querySelectorAll(selector)).some(el => el.checkVisibility())) return;

  e.preventDefault();

  const key = e.deltaY < 0 ? 'ArrowLeft' : 'ArrowRight';
  const keyCode = key === 'ArrowLeft' ? 37 : 39;

  document.dispatchEvent(new KeyboardEvent('keydown', {
    key, code: key, keyCode, which: keyCode, bubbles: true
  }));
}

function wheelMeBaby(selector) {
  document.addEventListener('wheel', (e) => maybeSendArrowKeyInstead(e, selector), { passive: false });
}

const domain = new URL(window.location.href).hostname;

if (domain.includes('bsky.app'))      wheelMeBaby('button[aria-label$="image"]');
if (domain.includes('imdb.com'))      wheelMeBaby('.media-viewer__page-right');
if (domain.includes('wikipedia.org')) wheelMeBaby('.mw-mmv-button');
