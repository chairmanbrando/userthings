// ==UserScript==
// @name        Reddit: Tools and Such
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @grant       none
// @version     1.1
// @author      chairmanbrando
// ==/UserScript==

// If you're not logged in, your preference to open links in new tabs ain't there.
if (document.querySelector('body:not(.loggedin)')) {
  let all = Array.from(document.querySelectorAll('.thing a[href]'));
  all     = all.filter((a) => a.href.indexOf('javascript') === -1);
  all.forEach((a) => a.target = '_blank');
}

// Your stuff should new-tab itself too.
document.querySelectorAll('#header-bottom-right a:not(.pref-lang, [onclick])').forEach((a) => a.target = '_blank');

// -------------------------------------------------------------------------- //

// The following are global functions on `window`. Run them in the console when you're looking at
// the page that's relevant for them. Yes, these could be in their own script to add them only when
// you've `@matched` the correct page, but I wanted all the reddit-related stuff in one file.

// Note: These are fairly heavily delayed in their operation because reddit doesn't like when too
// many things happen too quickly. Your IP address will start getting 429'd for a short while if you
// trigger the server's ire, so let these run with the provided delays and leave them be. You can
// watch the network log for 429 errors ("too many requests") if you want. If you're doing reddit
// through a VPN, it may be wise to make the delays even longer just in case.

/**
 * When looking at multireddit URL, e.g. /r/X+Y+Z, go through the list subscribe to each of them
 * that you're not already subscribed to. You can change the "add" class to "remove" if you'd like
 * to reverse the process.
 */
function subscribeToSubreddits() {
  document.querySelectorAll('a.option.add.active').forEach((a, i) => {
    setTimeout(() => {
      a.click();
    }, 2000 * i);
  });
}

/**
 * When looking at a multireddit, even a blank one just created, you can send this function a list
 * (or array) of subreddits and they'll be added to it. The expected formats are either a comma-
 * separated string or an array of strings. Neither should have "/r/" in them; just the names. But
 * just in case that string is removed if present.
 */
function addThingsToMultireddit(subs) {
  if (typeof subs === 'string') {
    subs = subs.split(',').map(s => s.trim());
  }

  const inpu = document.querySelector('#sr-autocomplete');
  const butt = inpu.nextElementSibling;

  subs.forEach((sub, i) => {
    setTimeout(() => {
     inpu.value = sub.trim().replace(/\/?r\//, '');
     butt.click();
    }, 4000 * i);
  });
}
