// ==UserScript==
// @name        Reddit: Bring Back Subscriber Count!
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/r/*/
// @exclude-match https://old.reddit.com/r/all/*
// @exclude-match https://old.reddit.com/r/popular/*
// @exclude-match https://old.reddit.com/r/friends/*
// @grant       none
// @version     1.2.5
// @author      chairmanbrando
// @description reddit recently stopped displaying a subreddit's subscriber
//              count in favor of a weekly measure of activity: visitors and
//              contributions. It makes sense since the number of subscribers
//              isn't demonstrable of activity, but (a) it's what I'm used to
//              and (2) the activity stats aren't showing up on old.reddit.com,
//              so there's instead no data at all. Thus, this script brings the
//              subscriber count back. I'd add the activity too if it were
//              included in `about.json`, but that doesn't seem to be the case.
//              Also missing these days is the fudged number of people active on
//              the subreddit at the moment, so the only way to measure activity
//              is to gauge it by how quickly submissions get old on its front
//              page.
// @note        The above @match rule hits both subreddit front pages as well as
//              any threads within them. If that's too annoying, you can replace
//              it with the the following that only hits subreddit front pages:
//              [@]include     /^https:\/\/old\.reddit\.com\/r\/[^/]+\/$/
// ==/UserScript==

// Don't run if there's a combined subreddit thing happening.
if (window.location.pathname.includes('+')) return;

// Remove HTML entities from a string. See: https://stackoverflow.com/a/7394787
const decodeHtml = (html) => (Object.assign(document.createElement('textarea'), { innerHTML: html }).value);

// Since we don't have an activity graph or stat, let's make our own.
function countPostsWithinPastWeek() {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const posts       = document.querySelectorAll('.entry');
  const now         = new Date();

  posts.forEach((post) => {
    const time = post.querySelector('time');
    if (! time) return;

    const then = new Date(time.getAttribute('datetime'));

    if (then && post.checkVisibility()) {
      if (now - then > 0 && now - then < ONE_WEEK_MS) {
        time.classList.add('within-a-week');
      }
    }
  });

  return document.querySelectorAll('.within-a-week').length;
}

const subreddit = window.location.pathname.match(/\/r\/(\w+)\//)[1];
const abouturl  = `https://old.reddit.com/r/${subreddit.toLowerCase()}/about.json`;

fetch(abouturl).then((r) => r.json()).then(about => {
  const h1   = document.querySelector('h1.redditname');
  const subs = about.data.subscribers.toLocaleString();
  const desc = decodeHtml(about.data.public_description_html);
  const list = (document.body.classList.contains('listing-page'));
  const recs = (list) ? countPostsWithinPastWeek() : null;

  // There used to be something in the settings for this, but that's gone too.
  // Each subreddit got to configure what the "users here now" string said, so
  // /r/rva might've said "RVA denizens" while /r/pathofexile might've said
  // "exiles on the beach". Some subreddits might use the `public_desecription`
  // property for it but others don't, but there's no way to know for sure if it
  // has a unit or is a description as expected.
  const units = 'subscribers';

  if (recs) {
    h1.insertAdjacentHTML('afterend', `<div class="md"><p><strong>${recs}</strong> posts last week</p></div>`);
  }

  h1.insertAdjacentHTML('afterend', `${desc}<div class="md"><p><strong>${subs} ${units}</strong></p></div>`);
});
