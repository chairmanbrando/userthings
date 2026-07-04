// ==UserScript==
// @name        Global: Asset Downloader
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @run-at      document-idle
// @version     1.2
// @author      chairmanbrando
// @description Adds a direct link to top-level asset views -- e.g. you're looking directly at an image.
// @note        Install this: https://addons.mozilla.org/en-US/firefox/addon/load-reddit-images-directly/
// ==/UserScript==

// @@ Known issue: You can't replace `.gif` with `.mp4` in many cases. It'll likely
// 404 because the transformation of content type is happening on the server. On
// reddit, for instance, going directly to a GIF link will send you that GIF and
// not the MP4 you saw by expanding the video on the site. If you download that GIF
// it will be huge. MP4s on reddit require going through its `preview.redd.it` with
// some parameter `s` that you probably can't get without API access or editing
// every URL to pass it along. So, um, don't visit reddit GIF links, I guess.

// Test for being on a single media asset that doesn't care if things are loaded.
if (! document.querySelector('body > :where(img, video, audio):only-child')) return;

// Get the display-formatted file size of the given URL.
function getFileSize(href) {
  let size = performance.getEntriesByName(href)[0].decodedBodySize;

  if (size) {
    const units = ['B', 'K', 'M', 'G'];
    const power = Math.floor(Math.log(size) / Math.log(1024));
    const fixed = (size / Math.pow(1024, power)).toFixed(2);

    return ` ${fixed}${units[power]}`;
  }

  return false;
}

// Styles to be injected.
const styles = `
  a.download {
    background-color: #f0f;
    color: #000;
    font-family: sans-serif;
    font-weight: bold;
    left: 0;
    line-height: 1;
    padding: 0.4em 0.5em 0.5em;
    position: fixed;
    opacity: 0.75;
    text-decoration: none;
    text-transform: uppercase;
    top: 0;
    z-index: 999;
  }

    a.download:not([href]) {
      display: none;
    }
`;

const style = document.createElement('style');

style.textContent = styles;
document.head.appendChild(style);

const href = window.location.href;
const path = window.location.pathname;
const a    = document.createElement('a');

a.textContent = '⤓';
a.setAttribute('href', href);
a.setAttribute('download', path.split('/').pop());
a.setAttribute('class', 'download');
a.setAttribute('title', 'Download and Close Tab');

// Since you can Ctrl-S the media normally anyway, clicking the download button
// might as well close the tab for you. Delayed a bit #jic.
a.addEventListener('click', (e) => {
  setTimeout(() => {
    window.close();
  }, 100);
});

document.body.appendChild(a);

let lastSize = null;

// Get the file's size, in a short loop. This way if it's big and/or the server
// is slow, we'll eventually figure out its full size.
const interval = setInterval(() => {
  const size = getFileSize(href);

  if (size && size === lastSize) {
    a.textContent += size;
    clearInterval(interval);
  } else {
    lastSize = size;
  }
}, 100);
