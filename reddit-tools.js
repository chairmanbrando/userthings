// ==UserScript==
// @name        Reddit: Tools and Such
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @grant       none
// @version     1.4.5
// @author      chairmanbrando
// @description Your mom sucks too.
// ==/UserScript==

/**
 * Returns a random number between `min` and `min + 1000`. Used in `setTimeout()`
 * calls to delay repeated calls a varying (but not too varying) amount.
 */
function randomDelay(min) {
  const t = min / 1000,
        s = min / t;

  return Math.round((Math.random() + t) * s);
}

// -------------------------------------------------------------------------- //

/**
 * When using old.reddit.com and RES, `/gallery/*` links on expando'd images are
 * useless as they redirect back to the comments page in a circle. We need to
 * replace said links to the image sources within.
 *
 * This event fires on initial loading/expansion of an image as well as actual
 * click-drag resizing, so we make sure to set a marker for efficiency whether
 * or not any link adjustment is done.
 */
document.body.addEventListener('mediaResize', (e) => {
  if (e.target.done) return;

  const a = e.target.querySelector('a');
  const i = e.target.querySelector('img');

  if (a && i) {
    if (a.href.indexOf('/gallery') > -1) {
      a.href = i.src;
    }
  }

  e.target.done = true;
});

// Occasionally there's a need to see someone's profile on not-old reddit.
if (location.href.includes('/overview')) {
  let url = location.href.replace('/overview', '');
      url = url.replace('old.', 'sh.');

  const html = `<p class="fancy-toggle-button"><a href="${url}" style="color:#ccc">view on shit.reddit.com</a></p>`;

  document.querySelector('.titlebox > div').insertAdjacentHTML('beforeend', html);
}

// Temporary bans are annoying because you still want to click on shit but can't.
if (document.querySelector('.timeout-infobar')) {
  document.body.classList.add('suspended');
}

// If you're not logged in, your preference to open links in new tabs ain't there.
if (document.querySelector('body:not(.loggedin)')) {
  let all = Array.from(document.querySelectorAll('.thing a[href]'));
      all = all.filter(a => a.href.indexOf('javascript') === -1);

  all.forEach(a => a.target = '_blank');
}

// Your stuff should new-tab itself too.
document.querySelectorAll('#header-bottom-right a:not(.pref-lang, [onclick])').forEach(a => a.target = '_blank');

// Add an extra span to scores for comments so one can have something to style.
document.querySelectorAll('span.score').forEach((score) => {
  const otc = score.textContent;
  let   pts = otc.match(/(-?\d+)\s+points/);

  if (pts && pts.length > 1) {
    const span = `<span class="points">${pts[1]}</span> points`;

    score.textContent = '';
    score.insertAdjacentHTML("beforeend", span);
  }
});

// Add a post's shortlink next to its comments link. Goes to your clipboard on
// click instead of uselessly opening the same post in a new tab.
document.querySelectorAll('a.comments').forEach((link) => {
  const id = link.href.split('/').filter(Boolean)[5];
  const li = link.parentElement.cloneNode(true);
  const a  = li.firstElementChild;

  li.classList = 'second';
  a.classList   = 'shortlink';
  a.href        = 'https://redd.it/' + id;
  a.textContent = 'shortlink';

  link.parentElement.after(li);

  a.addEventListener('click', (e) => {
    e.preventDefault();
    a.textContent = 'copied!';
    navigator.clipboard.writeText(a.href);
    setTimeout(() => a.textContent = 'shortlink', 2000);
  });
});

// Simialrly, automatically copy the shortlink input's value on click.
document.getElementById('shortlink-text').addEventListener('click', (e) => {
  const link = e.target.value;
  navigator.clipboard.writeText(e.target.value);
  e.target.value = 'copied!'
  setTimeout(() => e.target.value = link, 2000);
});


// -------------------------------------------------------------------------- //

// The following are global functions. Run them in the console when you're look-
// ing at the page that's relevant for them. Yes, these could be in their own
// script to add them only when you've `@matched` the correct page, but I wanted
// all the reddit-related stuff in one file.

// Note: These are fairly heavily delayed in their operation because the server
// doesn't like when too many things happen too quickly. Your IP address will
// start getting 429'd for a short while if you trigger its ire, so let these
// run with the provided delays and leave them be. You can watch the network log
// for 429 errors ("too many requests") if you want. If you're doing reddit
// through a VPN, it may be wise to make the delays even longer just in case.

/**
 * When looking at multireddit URL, e.g. /r/X+Y+Z, go through the list subscribe
 * to each of them that you're not already subscribed to. You can change the
 * "add" class to "remove" if you'd like to reverse the process.
 */
window.subscribeToSubreddits = function () {
  document.querySelectorAll('a.option.add.active').forEach((a, i) => {
    setTimeout(() => {
      a.click();
    }, randomDelay(4000) * i);
  });
}

/**
 * When looking at a multireddit, even a blank one just created, you can send
 * this function a list (or array) of subreddits and they'll be added to it. The
 * expected formats are either a comma-separated string or an array of strings.
 * Neither should have "/r/" in them; just the names. But just in case that
 * string is removed if present.
 */
window.addThingsToMultireddit = function (subs) {
  if (typeof subs === 'string') {
    subs = subs.replaceAll('+', ',');
    subs = subs.split(',').map(s => s.trim());
  }

  const inpu = document.querySelector('#sr-autocomplete');
  const butt = inpu.nextElementSibling;

  subs.forEach((sub, i) => {
    setTimeout(() => {
     inpu.value = sub.trim().replace(/\/?r\//, '');
     butt.click();
    }, randomDelay(5000) * i);
  });
}

/**
 * You can filter crappy subreddits from /r/all which makes it a bit more handy
 * than /r/popular. Even with a list stored in your notes, though, this is a
 * painful operation: flip to note, copy subreddit name, flip back to browser,
 * paste it into the right input, and submit the form. Send this function a list
 * (or array) of subreddits and let it handle it for you instead.
 *
 * @@ I've since learned that RES allows you to block subreddits, so use that.
 */
window.blockSubredditsFromAll = function (subs) {
  if (typeof subs === 'string') {
    subs = subs.split(',').map(s => s.trim());
  }

  const inpu = document.querySelector('input.sr-name');
  const butt = inpu.nextElementSibling;

  subs.forEach((sub, i) => {
    setTimeout(() => {
      inpu.value = sub.trim().replace(/\/?r\//, '');
      butt.click();
    }, randomDelay(4000) * i);
  });
}
