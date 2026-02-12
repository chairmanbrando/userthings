// ==UserScript==
// @name        YouTube: Disable AV1 Codec
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description If your system is old, it may not be able to hardware accelerate
//              this codec, and that can make videos choppy or jerky. I have an
//              RTX2080, which is basically ancient by now, and AV1 doesn't work
//              great for my watching of 1440p videos at 1.5x speed!
// ==/UserScript==

const origCanPlayType = HTMLMediaElement.prototype.canPlayType;

// Tell media elements that AV1 is verboten.
HTMLMediaElement.prototype.canPlayType = function(type) {
  if (type.includes('av01') || type.includes('av1')) {
    return '';
  }

  return origCanPlayType.call(this, type);
};

// Do the same for the MediaSource API.
if (window.MediaSource) {
  const origIsTypeSupported = MediaSource.isTypeSupported;

  MediaSource.isTypeSupported = function(type) {
    if (type.includes('av01') || type.includes('av1')) {
      return false;
    }

    return origIsTypeSupported.call(this, type);
  };
}
