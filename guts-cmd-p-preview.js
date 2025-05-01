// ==UserScript==
// @name        Gutenberg Preview Shortcut
// @namespace   Violentmonkey Scripts
// @match       https://*/wp-admin/post.php*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description Why would you ever print an editor screen? Let's make that keyboard shortcut open a preview tab instead!
// ==/UserScript==

document.body.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey) { // Cmd || Ctrl
    if (e.key.toLowerCase() === 'p') {
      e.preventDefault();
      window.open(wp.data.select('core/editor').getEditedPostPreviewLink(), '_blank');
    }
  }
});
