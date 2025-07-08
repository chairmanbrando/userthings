// ==UserScript==
// @name        DDG: Google Clicker
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @grant       none
// @version     1.10.0
// @author      chairmanbrando
// @description Adds a clickable link to Google in case you forget your `!g`. Typing a "g" without anything having keyboard focus will also send you there! Finally, you can use the 1-9 keys to go to the respective search results while still on DDG.
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @noframes
// ==/UserScript==

const search = encodeURIComponent(document.querySelector('#search_form_input').value);

const C = {
  ARRIVE:   { existing: true, onceOnly: true, timeout: 5000 },
  GOOGLEIT: `https://www.google.com/search?q=${search}&udm=14`,
};

// On hitting a key, go to Google with your query or one of the found links. We
// only do this if there's nothing else focused, though.
document.body.addEventListener('keyup', (e) => {
  if (e.target !== document.body) return;

  if (['g', 'G'].indexOf(e.key) > -1) {
    window.location.href = C.GOOGLEIT;
  }

  // The search results don't exist on `DOMContentLoaded`. Also, we need to fil-
  // ter them by those that are visible. I got confused when "1" tried to send
  // me to a uBO-blocked URL. Turns out there was an ad link in the first slot
  // that it had hidden for me. Oops.
  let links = document.body.querySelectorAll('ol li:has(article)');
      links = Array.from(links).filter((l) => l.checkVisibility());

  let link = links[e.key.charCodeAt(0) - 49];

  if (link) {
    link.classList.add('going-to-there');
    link = link.querySelector('h2 a[href]');

    if (link && link.href) {
      window.location.href = link.href;
    }
  }
});

// They changed their menus to use even more dynamic fetching. As it currently
// sits, the left-side menu starts with "All" and "Images" with the rest coming
// in async'ly.
function addGoogleToMenu(menu) {
  if (menu.querySelector('.dropdown--settings')) return; // Ignore the right-side menu.

  const li = menu.querySelector('li:last-child').cloneNode(true);
  const a  = li.querySelector('a');

  a.setAttribute('href', C.GOOGLEIT);
  a.textContent = 'Google It!';
  li.append(a);

  // We add our new Google link once the rest of the items have arrived. I could
  // have done *another* nested `arrive()` call but I didn't. 🤷‍♀️
  const check = setInterval(() => {
    if (menu.querySelectorAll('li').length > 2) {
      menu.querySelector('li:last-child').before(li);
      clearInterval(check);
    }
  }, 100);
}

// React is so annoying to tap into. Maybe I should've left this script using
// timeouts, but I wanted to do it "right". Now I'm nesting `arrive()` calls.
document.querySelector('#react-duckbar').arrive('ul', C.ARRIVE, (ul) => {
  ul.arrive('li', C.ARRIVE, () => addGoogleToMenu(ul));
});
