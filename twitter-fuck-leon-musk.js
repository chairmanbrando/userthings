// ==UserScript==
// @name           Twitter: Fuck That Neo-Nazi Bitch
// @namespace      Violentmonkey Scripts
// @match          *://*/*
// @exclude-match  https://x.com/*
// @exclude-match  https://xcancel.com/*
// @grant          none
// @version        1.2
// @author         chairmanbrando
// @description    While I would usually add a Redirection entry for something
//                 like this, sometimes you do need to visit the actual hellsite.
//                 Rather than force myself to disable the extension temporarily,
//                 handling links via JS means I can just slap "cancel" out of
//                 the domain once I'm there if I need to.
// ==/UserScript==

document.body.addEventListener('click', e => {
  const link = e.target.closest('a');
  const patt = /:\/\/(www\.)?(x|twitter)\.com/; // ://x.com, ://www.x.com, ://twitter.com, ://www.twitter.com

  if (link && patt.test(link.href)) {
    e.stopImmediatePropagation();
    link.href = link.href.replace(patt, '://xcancel.com');
  }
}, true);
