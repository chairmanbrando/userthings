// ==UserScript==
// @name        YouTube: 1.5x Me, Baby
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Who has time to watch videos on 1.0x speed anymore? This defaults videos to 1.5x except when it can ascertain that a video is in the "Music" category -- and when the video is 30 seconds or less in length.
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @noframes
// ==/UserScript==

/**
 * Let's get this dorodango rolling. YouTube only ever reloads parts of a page
 * as you navigate around, so we have to watch for the arrival of relevant bits.
 *
 * If the video has been flagged as age-restricted, an interstitial will be pre-
 * sented first. We wait for its button and then click it now so our hooks don't
 * run twice.
 */
document.addEventListener('yt-page-data-updated', (e) => {
  (document.querySelector('#player-error-message-container'))
    ? inter.arrive('button', { onceOnly: true, existing: true }, (button) => button.click())
    : document.arrive('#microformat', { onceOnly: true, existing: true }, onPageDataUpdated);
});

/**
 * We've got the div we're after, `#microformat`, so let's wait for the relevant
 * schema to show up. The initial one is a "Person" or whatever. The second is
 * the one with the video details. It starts empty, so we watch for changes in-
 * side which this Arrive library ain't about. Seems I still couldn't avoid the
 * annoying observer syntax after all.
 */
function onPageDataUpdated(div) {
  const schemata = document.querySelectorAll('script[type="application/ld+json"]');
  const schema   = Array.from(schemata).filter((s) => div.contains(s));

  const observer = new MutationObserver((muts) => {
    muts.forEach((mut) => {
      if (mut.type !== 'childList') return;

      try {
        const data = JSON.parse(mut.target.textContent);

        if (data) {
          observer.disconnect();
          onSchemaUpdate(data);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  // `childList` is required even if you're looking for a `#text` node inside.
  if (schema && schema.length) {
    observer.observe(schema.pop(), { characterData: true, childList: true });
  }
}

/**
 * The schema we're looking for has come, so let's wait for the player itself.
 * Even if the order of operations is off due to YouTube's partial page loads,
 * we need both before we can proceed to dealing with playback speed.
 */
function onSchemaUpdate(schema) {
  if (schema) {
    document.arrive('#movie_player', { onceOnly: true, existing: true }, (player) => {
      onPlayerArrival(player, schema);
    });
  }
}

function onPlayerArrival(player, schema) {
  if (player.getDuration() < 31) return;

  const genre = (schema?.genre) ? schema.genre : 'Unknown';
  const speed = (genre === 'Music') ? 1.0 : 1.5;

  player.setPlaybackRate(speed);
}
