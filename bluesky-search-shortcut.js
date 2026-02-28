// ==UserScript==
// @name        Bluesky: Search Focus Shortcuts
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Ctrl-Shift-F will now focus the search input. Adding Alt to it
//              will also drop `from:[yourhandle] ` in there, or the handle of
//              the profile you're visiting, so you can search for shit you or
//              they have said more easily.
// ==/UserScript==

const session = JSON.parse(localStorage.getItem('BSKY_STORAGE'));

function doAltKeyStuff(input, handle) {
  if (window.location.pathname.includes('/profile/')) {
    handle = window.location.pathname.split('/profile/')[1].split('/')[0];
  } else {
    handle = session?.session?.currentAccount?.handle;
  }

  if (handle) {
    setTimeout(() => {
      input.value = `from:${handle} `;
    }, 10);
  } else {
    input.select();
  }
}

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
    e.preventDefault();

    let inputs  = document.querySelectorAll('input:not([type="hidden"])');
        inputs  = Array.from(inputs).filter(input => input.checkVisibility());

    if (! inputs || ! inputs[0]) return;

    inputs[0].focus();

    if (e.altKey) {
      doAltKeyStuff(inputs[0]);
    } else {
      inputs[0].select();
    }
  }
});

