// ==UserScript==
// @name        Reddit: Collapse AutoModerator and Stickied Comments
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/r/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Many subreddits toss one into every single post automatically
//              these days. These are mostly useless but do occasionally matter,
//              so we'll add a preview into the `title` of the expa anchor.
// ==/UserScript==

// A "thing" is official reddit nomenclature used for both entries and comments.
function collapseThing(thing) {
  const expa = thing.querySelector('a.expand');
  const form = thing.querySelector('form');

  if (! expa || ! form)         return;
  if (! expa.checkVisibility()) return;

  expa.addEventListener('mouseover', (e) => {
    if (! form.checkVisibility() && ! expa.title) {
      expa.title = form.textContent.replace(/\s+/g, ' ').substr(0, 256) + '…';
    }
  });

  if (form.checkVisibility()) {
    expa.click();
  }
}

const stic = '.sitetable > .thing.stickied';
const auto = '.sitetable > .thing[data-author="AutoModerator"]';

document.querySelectorAll(stic).forEach(t => collapseThing(t));
document.querySelectorAll(auto).forEach(t => collapseThing(t));
