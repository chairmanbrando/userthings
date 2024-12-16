// ==UserScript==
// @name        Reddit: Old Favicon
// @namespace   Violentmonkey Scripts
// @match       https://*.reddit.com/*
// @grant       none
// @version     1.0
// @author      chairmanbrando
// @description The 2023 favicon is much worse than the one prior.
// ==/UserScript==

/* ⚠️ Requirement: Add `||redditstatic.com/desktop2x/img/favicon/*` to uBlock Origin. ⚠️ */

const fav = document.createElement('link');

fav.rel   = 'icon';
fav.type  = 'image/png';
fav.sizes = '32x32';

// If this doesn't work for some reason, use this backup: https://i.imgur.com/HM84EoB.png
fav.href  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD5UlEQVR4Aa3XA5BcSxTG8Xm2XyEuxba1+2Lbtm3btm3btm3bdjK7//dN3b1V6d07ySCn6rc77tPudvkS5HJ9I0mlkyyWo/JY3BEey+GI9zpIEvnGFXCYBWeX8XJZwoTPcMtFGSdZ5JtAC48jg+WeEKC7MlBi+lt4Vtkl4UKQwmWbZPC18HxyTvjCTkvo5wrP5nfh/0mohESwn9tyGU5Jhk/1+U7BZ6FSPzUsGgrjWkLrUCgXA9rnhaUjoVdZyPNN5O9tltiRC/9aBgt+JzCzO+xfDfMHwJ4VcHQLPLwFAI9uK8FUTi3RW77+OIEcAY/2tZNhSF3I6YLCv0KDNHBmHwA8uAF1kjslcFcyW4XnVu2teY7ffV/0DziwFtrkMvu/cUaY3B465De7wDREvvbUPplcCqj566WE49ugXCwVbr5HiDEInVySpK6I5TXM51rbP5xTBtWALXMgz3dmgb5xS0NPAosEm2Mt7KYt9hd0yAcze8CKMXDhEFw6BgsHw8iGVv8X+Mn8jt01uRxN8CRw1LGmVeNB/yrQPBuUiwljm8PJnfD2FY4RHg5PH1gzoX9lND6sAdihAJSJ7i2JI54EHkepeZNMVs0Anj2AKyfA/R6f4+1razreuwYf3sPJXWi8OHXRY08C7ii1XzwMx3j9Ap7cgzC3QwuEwcsn8P4djjGjm1MCbt8TuHcVuhWHmolh3ZTIpcPKcdAwLQytC0/vEyVm9fCawOMoCTRMB5ePY8SmWXrvG8jugla5zLHw6hk0ymy9l+d72LUMI66dRr/plMAjTwKHBUNOUU0gPOqPaLVjdm9r0Nnh/gAjG1mLTq2kcPUkRoxqAiGOg/Cw8zQMkfb54d0bjLhzGU7vhjcviRLPHsLu5XD5GEaEhUGfCt4SGOtJoL3jONCuxqWjBB13r0DNRE7N/0EauCIOkBcc14JxLazmteP5Y5jdCw5vMlvn/Vs4uhVmdIfHd8y1YWpnyPWVU+0vSGJ7Kx7rmEDh32HZSGsug/V/+wIYWB0GVLP6XRhYw7J1vpWM3fRrJkKJf70tQgPkq4/PgHe8JjG6Cep/cz04ux92LbHosV4DsLdhazcs9o+3/eG2pI98IBnoZQOSr6B2MpjYBg5vRPPcXIz0WCumtTNO6WgdQnJ9bdbc1N2u/cdJxJSt3rffCIV/s5LpUhSt+VIFuhaDuimhyO/OZ0HTOonh7VyYUU77dQgVY9fM9UnHJfXnTsYhjkkE77hk8fVukF42C19AuKyXVP7ejmJJb7krBOiOdJcYwVxOM8kQuSRuH49aF2SgpP+St+Qk0lAmyBHM6/kjOSzjpIEk9rXg/wEYGM5JXiwPQwAAAABJRU5ErkJggg==';

document.head.append(fav);
