// ==UserScript==
// @name        startpage.com -- Don't forget to bring a towel.
// @namespace   Violentmonkey Scripts
// @match       https://www.startpage.com/do/metasearch.pl*
// @match       https://www.startpage.com/sp/search
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description For some reason Startpage doesn't put your search terms in the
//              title of the document, so you'll just have no idea what a given
//              tab is for as it sits there waiting for you to return.
// ==/UserScript==

document.title = document.querySelector('input#q').value + ' — ' + document.title;
