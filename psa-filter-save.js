// ==UserScript==
// @name        PSA: Send Filter Selections to New Categories
// @namespace   Violentmonkey Scripts
// @match       https://palmettostatearmory.com/*.html
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description The sidebar offers you the ability to switch categories, to go
//              deeper into the tree, to more specific items, yet doesn't bring
//              your current filters along for the ride. You think you're about
//              to narrow the search down to, say, Holosun rifle red dots from
//              Holosun red dots, but that you've selected a brand filter is no
//              longer in play. The category links have reset your filters, and
//              you'll have to select Holosun again. It sounds like no big deal,
//              but it sucks as soon as you have more than one filter to redo
//              over and over as you drill down categories. Maybe it means I'm
//              using the site wrong -- that I should be going down through the
//              categories first. That's fine, I can admit when I'm wrong, but
//              why not let the wrong way be right if the fix is so easy?
// ==/UserScript==

// Continuing the description, if you're here...
//  ↳ /sights-optics-scopes/red-dot-sights.html?optic_max_magnification=1&optic_object_diameter=30&stock_filter=Show+Only+In+Stock
//
// The category link to rifle red dots is just...
//  ↳ /sights-optics-scopes/red-dot-sights/rifle-red-dots.html
//
// Clicking that link will kill your four filters. If you want them back you'll
// have to click them all again. And some of the filter sections will probably
// be collapsed! Well, screw that. This little script sticks your filters, which
// are luckily just regular query variables, onto those category links.
//
// Thus, the category link to rifle red dots will take you here instead...
//  ↳ /sights-optics-scopes/red-dot-sights/rifle-red-dots.html?optic_max_magnification=1&optic_object_diameter=30&stock_filter=Show+Only+In+Stock

document.querySelectorAll('.filter-options-title').forEach($0 => {
  if ($0.textContent.toLowerCase().includes('category')) {
    $0.nextElementSibling.querySelectorAll('.item a').forEach($1 => {
      $1.href = $1.pathname + window.location.search;
    });
  }
});
