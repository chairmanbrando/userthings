// ==UserScript==
// @name        Reddit: Color-coded Multireddits
// @namespace   Violentmonkey Scripts
// @match       https://*.reddit.com/user/*/m/*
// @grant       none
// @version     2.1
// @author      chairmanbrando
// @description Each post in a multireddit has its rank color-coded based on a hash of its name converted to an RGB hexcode. `.subreddit-*` classes are also added; you can target them with a userstyle to override. Change the hashing salt on L45 to something else to generate new colors.
// ==/UserScript==

// @todo Add a counter somewhere to see the spread of each subreddit.

// Swiped for somewhere on the internet. I forget.
function stringToHash(string) {
  return string.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}

function colorizeSubreddits() {
  const subs   = [];

  // Add all unique subreddits to a list.
  document.querySelectorAll('.linklisting > .thing:not(.promoted)').forEach((post) => {
    const sub = post.getAttribute('data-subreddit');

    if (subs.indexOf(sub) === -1) {
      subs.push(sub);
    }

    post.classList.add('subreddit-' + subs.indexOf(sub));
    post.classList.add('subreddit-' + sub);
  });

  const colors = [];
    let hash   = '';
    let style  = '';

  // Generate that many unique (or "unique") colors by hashing the subreddit
  // name plus some salt into a decently large number. This number is converted
  // to base-16, and the last six characters are then used as an RGB hex. This
  // way no matter how many subreddits are in your multireddit, there will be
  // enough colors to go around. That said, if certain set of subreddits have
  // colors that are too close to each other, change the salt below to literally
  // anything else until you find a set of colors you like.
  subs.forEach((sub) => {
    hash = stringToHash(sub + 'severed');
    colors.push('#' + hash.toString(16).slice(-6));
  });

  // Make a `<style>` tag to apply all those colors.
  colors.forEach((c, i) => {
    style += `.subreddit-${i} .rank { background-color: ${c} } `;
  });

  document.head.insertAdjacentHTML('beforeend', '<style>%s</style>'.replace('%s', style));
}

colorizeSubreddits();
window.addEventListener('neverEndingLoad', colorizeSubreddits);
