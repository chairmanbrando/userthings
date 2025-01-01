// ==UserScript==
// @name        Global: CSS Domain/URL Support
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.4
// @author      chairmanbrando
// @run-at      document-start
// @description Runs as soon as possible for a web extension to add the page's domain as a class on the `<html>` element.
// ==/UserScript==

let hn = window.location.hostname.split('.');
let sr = null; // Used for reddit only.

while (hn.length > 2) {
    hn.shift();
}

hn = hn.join('-');

if (hn === '0-1') {
    hn = 'localhost';
}

if (hn === 'reddit-com') {
    sr = window.location.pathname.toLowerCase();
    sr = sr.split('/').filter((p => p.length));

    if (sr.length > 1) {
        sr = `${sr[0]}-slash-${sr[1]}`;
    }
}

function addClassToDamnedRootElement() {
    document.documentElement.classList.add(hn);

    if (sr) {
        document.documentElement.classList.add(sr);
    }
}

// Add our handy class as soon as possible...
addClassToDamnedRootElement();

//...but also watch for changes and reapply if necessary. These JS frameworks are out of control!
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
            if (!document.documentElement.classList.contains(hn)) {
                addClassToDamnedRootElement();
            }
        }
    }
});

observer.observe(document.documentElement, {
    attributes: true,
    childList: false,
    subtree: false
});
