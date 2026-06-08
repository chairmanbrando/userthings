// ==UserScript==
// @name        Global: Image New Tabber
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1.4
// @author      chairmanbrando
// @description I don't think Alt- or Option-clicking on images does anything by
//              default, so why not use that as a trigger to open an image in a
//              new tab? Sites that are known to use programmatic resizing scripts
//              that can be "undone" are handled as I come across them.
// ==/UserScript==

function urlKeepOnly(url, keeper) {
  const urlo = new URL(url);
  const kept = urlo.searchParams.get(keeper);

  urlo.search = "";

  if (kept !== null) {
    urlo.searchParams.set(keeper, kept);
  }

  return urlo.toString();
}

// @@ Is it smarter or dumber to use the image's hostname instead?
document.addEventListener('click', (e) => {
  if (e.altKey && e.target.tagName === 'IMG') {
    let host = window.location.hostname;
    let src  = e.target.currentSrc || e.target.src;

    if (host.includes('apnews.com')) {
      src = src.split('url=');
      src = (src.length > 1) ? decodeURIComponent(src[1]) : src[0];
    }

    // @@ A potentially better option exists: https://gist.github.com/Tarrgon/a58375cd3c1f15d8fd4238a2a7df35b5
    if (host.includes('bsky.app')) {
      src = src.replace('feed_thumbnail', 'feed_fullsize');
    }

    // I don't read this dumb site, but it's the first not-AP one I hit.
    else if (host.includes('ft.com')) {
      src = urlKeepOnly(src, 'source');
    }

    else if (host.includes('richmonder.org')) {
      src = src.replace(/\/size\/w\d+/, '')
    }

    else if (host.includes('substack.com')) {
      src = src.split('/https');
      src = (src.length > 1) ? 'https' + decodeURIComponent(src[1]) : src[0];
    }

    window.open(src, '_blank');
    e.preventDefault();
  }
}, true); // true = capture phase
