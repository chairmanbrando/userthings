// ==UserScript==
// @name        reddit: Bring Back Subscriber Count!
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/r/*/
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description reddit recently stopped displaying a subreddit's subscriber
//              count in favor of a weekly measure of activity: visitors and
//              contributions. It makes sense since the number of subscribers
//              isn't demonstrable of activity. But (a) it's what I'm used to
//              and (2) the activity stats aren't showing up on old.reddit.com,
//              so there's instead no data at all. Thus, this script brings the
//              subscriber count back. I'd add the activity too if it were
//              included in `about.json`, but that doesn't seem to be the case.
// @note        The above @match rule hits both subreddit front pages as well as
//              any threads within them. If that's too annoying, you can replace
//              it with the the following that only hits subreddit front pages:
//              [@]include     /^https:\/\/old\.reddit\.com\/r\/[^/]+\/$/
// ==/UserScript==

const subreddit = window.location.pathname.match(/\/r\/(\w+)\//)[1];
const abouturl  = `https://old.reddit.com/r/${subreddit.toLowerCase()}/about.json`;

fetch(abouturl).then(r => r.json()).then(about => {
  const h1   = document.querySelector('h1.redditname');
  const subs = `Subs: ${about.data.subscribers.toLocaleString()}`;

  h1.insertAdjacentHTML('afterend', `<p class="md"><strong>${subs}</strong></p>`);
});
