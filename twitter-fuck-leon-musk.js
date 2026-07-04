// ==UserScript==
// @name           Twitter: Fuck That Neo-Nazi Bitch
// @namespace      Violentmonkey Scripts
// @match          *://*/*
// @exclude-match  https://x.com/*
// @exclude-match  https://xcancel.com/*
// @grant          none
// @version        1.0
// @author         chairmanbrando
// @description    While I would usually add a Redirection entry for something
//                 like this, sometimes you do need to visit the actual hellsite.
//                 Rather than force myself to disable the extension temporarily,
//                 handling links via JS means I can just slap "cancel" out of
//                 the domain once I'm there if I need to.
// ==/UserScript==

document.body.addEventListener('click', e => {
  if (e.target.nodeName !== 'A') return;

  if (e.target.href.includes('x.com')) {
    e.target.href = e.target.href.replace('x.com', 'xcancel.com');
  }
}, true);
