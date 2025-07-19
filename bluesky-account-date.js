// ==UserScript==
// @name        Bluesky: Account Creation Date Adder
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @run-at      document-idle
// @version     1.4.1
// @author      chairmanbrando
// @description Attempts to add the creation date and a posts-per-day average to a user's profile. Note that Bluesky says somewhere in its docs that this may not be accurate due to the distributed nature of the network protocol, but I'm sure this is only the case for very few accounts that might've been created elsewhere.
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @noframes
// ==/UserScript==

function addThingToStats(thing, after, list) {
  const item = list.querySelector(':scope > div').cloneNode(true);

  item.classList.add('stat', `stat-${after}`);
  item.innerHTML = item.innerHTML.replace(/.+?\s/, `${thing} `);
  item.querySelector(':scope > span').textContent = after;
  list.append(item);

  return item;
}

// Where is your medium to high rating for posts per day? Decide here. Anything
// below your range will stay white; anything above it will be fully red. In be-
// tween will be some shade of orange from yellow-orange to red-orange.
function colorizeSpammers(thing, ppd) {
  const range = { mid: 5, hot: 10 };

  if (ppd > range.mid) {
    let severity = (ppd - range.mid) / (range.hot - range.mid);
        severity = Math.min(severity, 1);

    thing.style.color = `rgb(255, ${255 - 255 * severity}, 0)`;
  }
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

  // Sometimes our profile-data request finishes earlier than the one that pop-
  // ulates the profile's line of stats. I didn't much feel like doing nested
  // MutationObservers at the time I was debugging this issue, so I cheated.
  statsWatch = setInterval(() => {
    let link = profile.querySelector(':scope a[data-testid="profileHeaderFollowersButton"]');

    if (link) {
      clearInterval(statsWatch);

      const born = addThingToStats(since, 'born', link.parentElement);
      const spd  = addThingToStats(ppd, 'spd', link.parentElement);

      colorizeSpammers(spd, ppd);

      // Add class to all stat things in case we want to CSS them.
      link.parentElement.querySelectorAll(':scope > :is(div, a)').forEach((li) => li.classList.add('stat'));
    }
  }, 100);
}

function fetchProfileData(username) {
  const endpoint = 'app.bsky.actor.getProfile?actor=';
  console.log('BACDA fetching:', endpoint + username);

  return fetch(`https://public.api.bsky.app/xrpc/${endpoint + username}`).then((resp) => resp.json());
}

// It's more efficient to look within a container, but the one that contains
// profiles shows up asynchronously too and things go awry. `arrive()` is a nicer
// syntax for basic MutationObserver stuff, and if that class is inefficient then
// I guess this will be too.
//
// @@ Doesn't always fire when loading your own profile from the sidebar.
document.arrive('div[data-testid="profileScreen"]', (profile) => {
  let username = document.title.match(/@([\w\.-]+)/).pop();
      username = username.replace(')', ''); // Caught by `\S+`.

  if (username) {
    fetchProfileData(username).then((data) => {
      addStuffToProfile(data, profile);
    });
  }
});
