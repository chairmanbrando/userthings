// ==UserScript==
// @name        DDG: Google Clicker
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @grant       none
// @version     1.9.1
// @author      chairmanbrando
// @description Adds a clickable link to Google in case you forget your `!g`. Typing a "g" without anything having keyboard focus will also send you there! Finally, you can use the 1-9 keys to go to the respective search results while still on DDG.
// @noframes
// ==/UserScript==

const google = 'https://www.google.com/search?q=' + encodeURIComponent(document.querySelector('#search_form_input').value);

// On hitting a key, go to Google with your query or one of the found links.
// Only do this if there's nothing else focused, though.
document.body.addEventListener('keyup', (e) => {
  if (e.target !== document.body) return;

  if (['g', 'G'].indexOf(e.key) > -1) {
    window.location.href = google;
  }

  // The links also don't seem to exist on `DOMContentLoaded`. 🤨
  //
  // Also, we need to filter them by those that are visible. I got confused when
  // "1" tried to send me to a uBO-blocked URL. Turns out there was an ad link
  // in the first slot that it had hidden for me. Oops.
  let links = document.body.querySelectorAll('ol li:has(article)');
      links = Array.from(links).filter((l) => l.checkVisibility());

  const link = links[e.key.charCodeAt(0) - 49].querySelector('h2 a[href]');

  if (link && link.href) {
    window.location.href = link.href;
  }
});

const $menu = document.querySelector('#react-duckbar ul:first-of-type'),
        $li = $menu.querySelector('li:last-child').cloneNode(true),
         $a = $li.querySelector('a');

$a.setAttribute('href', google);
$a.textContent = 'Google It!';
$li.append($a);
$menu.append($li);
