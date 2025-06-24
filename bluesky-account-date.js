// ==UserScript==
// @name        Bluesky: Account Creation Date Adder
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @run-at      document-idle
// @version     1.0
// @author      chairmanbrando
// @description Attempts to add the profile's creation date to their page.
// ==/UserScript==

const endpoint  = 'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=';
  let lastTitle = null;

function addCreationDate(list, date) {
  const item = list.lastChild.cloneNode(true);

  item.innerHTML = item.innerHTML.replace(/.+?\s/, `${date} `);
  item.querySelector('span').textContent = 'born';

  list.append(item);
}

// Maybe more stuff will happen here, but for now it's just adding the listed
// creation date. Note that Bluesky says somewhere in its docs that this may not
// be accurate due to the distributed nature of the network protocol, but I'm
// sure this is only the case for very few accounts.
function addStuffToProfile(data) {
  if (! data.createdAt) return;

  const created = new Date(data.createdAt);

  const date = created.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric'
  }); // "Oct 9, 2024"

  const link = document.querySelector('a[href$="/followers"]');

  if (link) {
    addCreationDate(link.parentElement, date);
  }
}

function fetchProfileData(profile) {
  fetch(endpoint + profile).then((resp) => resp.json()).then(addStuffToProfile);
}

const titleWatch = new MutationObserver((mutations, observer) => {
  if (document.title === lastTitle)    return;
  if (! document.title.includes('(@')) return; // Name (@username) — Bluesky

  lastTitle = document.title;

  // Bluesky loads and unloads views by some unknown heuristic, hiding the ones
  // that aren't currently being viewed, so more than one profile can exist in
  // the DOM at any time. Thus, we check for the visible one.
  const profiles = document.querySelectorAll('div[data-testid="profileScreen"]');

  for (profile of profiles) {
    if (profile && profile.checkVisibility()) {
      fetchProfileData(window.location.href.split('/').pop());
      break;
    }
  }
});

// It's easier to watch for title changes than piecemeal sections of the DOM.
titleWatch.observe(document.querySelector('title'), { childList: true });
