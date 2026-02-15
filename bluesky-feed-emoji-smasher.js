// ==UserScript==
// @name        Bluesky: Remove Emojis in Feed Names
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @version     1.1
// @author      chairmanbrando
// @description Emojis in feed names always bothered me, but Bluesky recently added
//              separate icons to them, so now those feeds are doubled up. Now it's
//              bothering me doubly, so the emojis must die.
// ==/UserScript==

// @note `{Emoji}` is too broad and hits numbers. If this one isn't enough, one
// even further beyond exists: `{Extended_Pictographic}`
const emojiRegex = /\p{Emoji_Presentation}/gu;

function emojiCheck(div) {
  if (div.getAttribute('aria-label')?.match(emojiRegex)) {
    const label = div.querySelector('div[dir]');
    label.textContent = label.textContent.replace(emojiRegex, '');
  }
}

// Initial check in case they're in the DOM before this script runs.
document.querySelectorAll('div[aria-label]').forEach(emojiCheck);

// If not, since Bluesky is asychronous *and* lacks classes and IDs on elements,
// we have to resort to watching for specific elements amongst the entire soup.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        node.querySelectorAll?.('div[aria-label]').forEach(emojiCheck);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
