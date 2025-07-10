// ==UserScript==
// @name        Bluesky: Account Creation Date Adder
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @run-at      document-idle
// @version     1.3.1
// @author      chairmanbrando
// @description Attempts to add the creation date and a posts-per-day average to a user's profile. Note that Bluesky says somewhere in its docs that this may not be accurate due to the distributed nature of the network protocol, but I'm sure this is only the case for very few accounts.
// ==/UserScript==

// Got tired of passing this div around function to function. Most didn't even
// use it; they simply passed it on untouched. That was a smell, and so is this.
let visibleProfile = null;
let lastUsername   = null;

function addThingToStats(thing, after, list) {
  const item = list.querySelector(':scope > div').cloneNode(true);

  item.innerHTML = item.innerHTML.replace(/.+?\s/, `${thing} `);
  item.querySelector(':scope > span').textContent = after;
  list.append(item);
}

function addStuffToProfile(data) {
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

  // Sometimes our profile-data request finishes earlier than the one that pop-
  // ulates the profile's line of stats. I didn't much feel like doing nested
  // MutationObservers at the time I was debugging this issue, so I cheated.
  statsWatch = setInterval(() => {
    let link = visibleProfile.querySelector(':scope a[data-testid="profileHeaderFollowersButton"]');

    if (link) {
      addThingToStats(since, 'born', link.parentElement);
      addThingToStats(ppd, 'spd', link.parentElement);
      clearInterval(statsWatch);
    }
  }, 100);
}

function fetchProfileData(username) {
  return fetch('https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=' + username)
    .then((resp) => resp.json());
}

const titleWatch = new MutationObserver((mutations, observer) => {
  if (document.title.includes('did:')) return;
  if (! document.title.includes('@'))  return;

  // Profile document titles are formatted in one of the following ways:
  //
  // - Name (@username) — Bluesky
  // - @username — Bluesky
  //
  // We have to account for people who don't set a dedicated display name.
  let username = document.title.match(/\(?@(\S+)\)?/).pop();
      username = username.replace(')', '');

  // Sometimes the title changes twice at discrete enough times, one without the
  // display name and then another with it, that our callback here is run twice.
  // We have to stop execution in that case or we'll end up with dupes.
  if (username === lastUsername) return;

  lastUsername = username;

  // Bluesky loads and unloads views by some unknown heuristic, hiding the ones
  // that aren't currently being viewed, and this means more than one profile
  // can exist in the DOM at the same time. Thus, we check for the visible one.
  for (const profile of document.querySelectorAll('div[data-testid="profileScreen"]')) {
    if (profile && profile.checkVisibility()) {
      visibleProfile = profile;
      fetchProfileData(username).then(addStuffToProfile);
      break;
    }
  }
});

// It's easier to watch for title changes than piecemeal sections of the DOM
// that are filled up asynchronously as various requests come back.
titleWatch.observe(document.querySelector('title'), { childList: true });
