// ==UserScript==
// @name        Bluesky: Account Creation Date Adder
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @run-at      document-idle
// @version     1.2.1
// @author      chairmanbrando
// @description Attempts to add the creation date and a posts-per-day average to a user's profile. Note that Bluesky says somewhere in its docs that this may not be accurate due to the distributed nature of the network protocol, but I'm sure this is only the case for very few accounts.
// ==/UserScript==

function addThingToStats(thing, after) {
  const link = profile.querySelector(':scope a[href$="/followers"]');

  if (! link) return;

  const list = link.parentElement;
  const item = list.querySelector(':scope > div').cloneNode(true);

  item.innerHTML = item.innerHTML.replace(/.+?\s/, `${thing} `);
  item.querySelector(':scope > span').textContent = after;
  list.append(item);
}

function addStuffToProfile(data, profile) {
  const created = new Date(data.createdAt);
  const now     = new Date;

  const since = created.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric'
  }); // "Oct 9, 2024"

  // Try to minimize weirdness in date difference calculation.
  created.setHours(12, 0, 0);
  now.setHours(12, 0, 0);

  const days = Math.round((now - created) / (1000 * 24 * 60 * 60));
  const ppd  = (data.postsCount / days).toFixed(2);

  addThingToStats(since, 'born');
  addThingToStats(ppd, 'ppd');
}

function fetchProfileData(username, profile) {
  fetch('https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=' + username)
    .then((resp) => resp.json())
    .then((data) => addStuffToProfile(data, profile));
}

let lastTitle = null;

const titleWatch = new MutationObserver((mutations, observer) => {
  if (document.title === lastTitle)    return;
  if (! document.title.includes('(@')) return; // Name (@username) — Bluesky

  username  = document.title.match(/\(@(\S+)\)/).pop();
  lastTitle = document.title;

  const profiles = document.querySelectorAll('div[data-testid="profileScreen"]');

  // Bluesky loads and unloads views by some unknown heuristic, hiding the ones
  // that aren't currently being viewed, so more than one profile can exist in
  // the DOM at any time. Thus, we check for the visible one.
  for (profile of profiles) {
    if (profile && profile.checkVisibility()) {
      fetchProfileData(username, profile);
      break;
    }
  }
});

// It's easier to watch for title changes than piecemeal sections of the DOM
// that are filled up asynchronously as various requests come back.
titleWatch.observe(document.querySelector('title'), { childList: true });
