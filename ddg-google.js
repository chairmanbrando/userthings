// ==UserScript==
// @name        DDG: Google Clicker
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @grant       none
// @run-at      document-idle
// @version     1.13.1
// @author      chairmanbrando
// @description It started by adding a link to Google under the search box. Now it does too much. Check comment inside for list of features.
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @noframes
// ==/UserScript==

/**
 * THIS HAS GONE TOO FAR -- FEATURE LIST
 *
 * Adds a clickable link to Google in case you forget your `!g`.
 *
 * With nothing having keyboard focus, i.e. the default state after a search,
 * you can hit the following keys to redo your search on the respective site:
 *
 *  - d → Merriam-Webster
 *  - g → Google
 *  - i → IMDb
 *  - m → Merriam-Webster
 *  - r → reddit site search
 *  - w → Wikipedia
 *  - y → YouTube
 *
 * Hitting "/" will highlight the search box so you can do another without using
 * the mouse to get back up there and the input focused.
 *
 * Hitting the spacebar will go to the first result. Your browser may or may not
 * scroll down a bit on DDG before loading the other site.
 *
 * The 1-9 keys will go the matching nth search result. No, 0 does not go to the
 * tenth because I didn't feel like bothering with it. Yes, this means you can't
 * get at the tenth with a single keypress, but whene do you ever not go to the
 * first couple results?
 *
 * The J/K keys can be used to highlight an adjacent link, starting with the
 * first, of course, and then you can go to it with Enter.
 */

const G = {
  $input:   document.querySelector('#search_form_input'),
  location: window.location.toString(),
  url:      new URL(window.location),
  which:    -1
};

G.search = encodeURIComponent(G.$input.value);

const C = {
  ARRIVE:   { existing: true, onceOnly: true, timeout: 5000 },
  GOOGLEIT: `https://www.google.com/search?q=${G.search}&udm=14`,
  IMDBIT:   `https://www.imdb.com/find/?q=${G.search}`,
  MWEBIT:   `https://www.merriam-webster.com/dictionary/${G.search}`,
  REDDIT:   G.location.replace('q=', 'q=site:reddit.com+'),
  WIKIIT:   `https://en.wikipedia.org/w/index.php?search=${G.search}&title=Special%3ASearch`,
  YTUBEIT:  `https://www.youtube.com/results?search_query=${G.search}`
};

console.log(G, C);

// On hitting a key, go to Google et al. with your query or one of the found
// links. We only do this if there's nothing else focused, though.
document.body.addEventListener('keydown', (e) => {
  if (e.target !== document.body) return;
  if (G.$input.matches(':focus')) return;

  // If this works, nothing below it matters.
  if (goToLink(e.key.charCodeAt(0) - 49)) return;

  // 'M' clashes with a DDG keyboard shortcut, so you'll have to turn 'em off.
  // '/' clashes with a Firefox keyboard shortcut for "quick find" if enabled.
  // Spacebar may still scroll down.
  switch (e.key.toLowerCase()) {
    case ' ' :     goToLink(0); e.preventDefault(); return; // Same as hitting '1'
    case 'd' :     window.location.href = C.MWEBIT; break;
    case 'g' :     window.location.href = C.GOOGLEIT; break;
    case 'i' :     window.location.href = C.IMDBIT; break;
    case 'j' :     G.which = selectALink(G.which, 1); break;
    case 'k' :     G.which = selectALink(G.which, -1); break;
    case 'm' :     window.location.href = C.MWEBIT; break;
    case 'r' :     window.location.href = C.REDDIT; break;
    case 'w' :     window.location.href = C.WIKIIT; break;
    case 'y' :     window.location.href = C.YTUBEIT; break;
    case '/' :     G.$input.select(); e.preventDefault(); break;
    case 'enter' : goToLink(G.which); break;
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
  // have done *another* nested `arrive()` call but I didn't.
  const check = setInterval(() => {
    if (menu.querySelectorAll('li').length > 2) {
      menu.querySelector('li:last-child').before(li);
      clearInterval(check);
    }
  }, 100);
}

// The search results don't exist on `DOMContentLoaded`. Also, we need to filter
// them by those that are visible. I got confused when "1" tried to send me to a
// uBO-blocked URL. Turns out there was an ad link in the first slot that it had
// hidden for me. Oops.
function getVisibleLinks() {
  const links = document.body.querySelectorAll('ol li[data-layout="organic"]:has(article)');

  return (links) ? Array.from(links).filter((l) => l.checkVisibility()) : []
}

// Go to the `num`th visible link in the search results.
function goToLink(num) {
  const links = getVisibleLinks();
    let link  = links[num];

  if (link) {
    link.classList.add('going-to-there');
    link = link.querySelector(':scope h2 a[href]');

    if (link && link.href) {
      window.location.href = link.href;
      return true;
    }
  }

  return false;
}

// Select the first or an adjacent link if possible.
function selectALink(which, modifier = 0) {
  const links = getVisibleLinks();

  which += modifier;
  which = Math.max(0, Math.min(which, links.length - 1));

  links.forEach(l => l.classList.remove('selected'));

  const link = links[which];

  if (link) {
    link.classList.add('selected');
    link.scrollIntoView(false);
  }

  return which;
}

// React is so annoying to tap into. Maybe I should've left this script using
// timeouts, but I wanted to do it "right". Now I'm nesting `arrive()` calls.
document.querySelector('#react-duckbar').arrive('ul', C.ARRIVE, (ul) => {
  ul.arrive('li', C.ARRIVE, () => addGoogleToMenu(ul));
});
