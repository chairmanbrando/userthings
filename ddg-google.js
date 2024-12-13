// ==UserScript==
// @name        DDG: Google Clicker
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @grant       none
// @version     1.8
// @author      chairmanbrando
// @description Adds a clickable link to Google in case you forget your `!g`. Typing a "g" without anything having keyboard focus will also send you there!
// @todo        `event.keyCode` has been deprecated because of reasons. Finally, you can use the 1-9 keys to go to the respective search results while still on DDG.
// @noframes
// ==/UserScript==

const google = 'https://www.google.com/search?q=' + encodeURIComponent(document.querySelector('#search_form_input').value);

// On hitting a key, go to Google with your query or one of the found links.
// Only do this if there's nothing else focused, though.
document.body.addEventListener('keyup', (e) => {
  if (e.target !== document.body) return;

  if (e.keyCode === 71) { // G key!
    window.location.href = google;
  }

  // The links also don't seem to exist on `DOMContentLoaded`. 🤨
  const links = document.body.querySelectorAll('ol li:has(article)');
  const link  = links[e.keyCode - 49].querySelector('h2 a[href]');

  if (link && link.href) {
    window.location.href = link.href;
  }
});

const $menu = document.querySelector('#react-duckbar ul:first-of-type'),
      $li   = $menu.querySelector('li:last-child').cloneNode(true),
      $a    = $li.querySelector('a');

$a.setAttribute('href', google);
$a.textContent = 'Google It!';
$li.append($a);
$menu.append($li);
