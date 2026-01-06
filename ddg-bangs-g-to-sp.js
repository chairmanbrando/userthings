// ==UserScript==
// @name        DDG: `!g` → `!sp`
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Google gets worse every year in various ways: results, bullshit,
//              and tracking. So, fuck 'em. Let's forward `!g` to Startpage. It
//              uses Google's search results database but without all the shit.
//              Yes, `!sp` exists, but `!g` is shorter and well ingrained.
// ==/UserScript==

const url   = new URL(window.location.href);
const query = url.searchParams.get('q');

if (query && query.trim().includes('!g')) {
  url.searchParams.set('q', query.replace('!g', '!sp'));
  window.location.replace(url.toString());
}
