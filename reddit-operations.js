// ==UserScript==
// @name        Reddit: Operations
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/r/*+*
// @match       https://old.reddit.com/user/*/m/test*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Adds global functions you can use from the console to assist in subreddit subscriptions.
// @todo        Add these to the existing `reddit` object. Nothing really gained by that, but it's there, so why not?
// ==/UserScript==

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
