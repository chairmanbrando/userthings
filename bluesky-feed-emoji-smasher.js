// ==UserScript==
// @name        Bluesky: Remove Emojis in Feed Names
// @namespace   Violentmonkey Scripts
// @match       https://bsky.app/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Does what it says, yo!
// ==/UserScript==

// @note `{Emoji}` is too broad and hits numbers. If this one isn't enough, one
// even further beyond exists: `{Extended_Pictographic}`
const emojiRegex  = /\p{Emoji_Presentation}/u;
const emojiRegexG = /\p{Emoji_Presentation}/gu;
const justTextDiv = ':scope > div:not(:has(div, img, svg))';

// Since Bluesky is all asychronous *and* lacks classes and IDs on elements, we
// have to resort to watching for specific elements amongst the entire soup.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.tagName === 'DIV' && node.getAttribute('aria-label')?.match(emojiRegex)) {
          const label = node.querySelector(justTextDiv);
          label.textContent = label.textContent.replace(emojiRegexG, '');
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
