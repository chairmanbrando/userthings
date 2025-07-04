// ==UserScript==
// @name        Wikipedia: Article Word Count
// @namespace   Violentmonkey Scripts
// @match       https://en.wikipedia.org/wiki/*
// @grant       none
// @version     1.1.0
// @author      chairmanbrando
// @description Attempts to turn the body content of an article into a string to figure out how many words it contains.
// ==/UserScript==

// I don't know yet if this works on any other skins than the one I'm using.
const content = document.querySelector('#bodyContent .mw-parser-output[lang]');
  let cleaned = '';

// Skip many things, including those not rendered, that would pad the reported
// length. There's a lot of stuff that can appear in the article body that's not
// a true part of it.
for (element of content.querySelectorAll(':scope > *')) {
  if (! element.checkVisibility())       continue;
  if (element.matches('table.metadata')) continue;
  if (element.matches('table.nomobile')) continue;

  if (element.querySelector('#External_links'))  break;
  if (element.querySelector('#Further_reading')) break;
  if (element.querySelector('#References'))      break;
  if (element.querySelector('#See_also'))        break;

  cleaned += element.textContent.trim();
}

// More cleanup for increased accuracy.
cleaned = cleaned.replaceAll('[edit source]', ' ');
cleaned = cleaned.replaceAll(/\[\d+?\]/gm, ' ');
cleaned = cleaned.replaceAll(/\s+?/gm, ' ');

// I couldn't get reruns of the last pattern above to work for whatever reason.
while (cleaned.includes('  ')) {
  cleaned = cleaned.replaceAll('  ', ' ');
}

cleaned = cleaned.trim();
cleaned = cleaned.split(' ').length;

if (! cleaned) return;

const lnavu = document.querySelector('#left-navigation ul');
const litem = `<li class="mw-list-item words">~${cleaned} words</li>`;
const style = '<style>.mw-list-item.words { margin: 0 8px; padding: 12px 0 7px }</style>';

lnavu.insertAdjacentHTML('beforeend', litem + style);
