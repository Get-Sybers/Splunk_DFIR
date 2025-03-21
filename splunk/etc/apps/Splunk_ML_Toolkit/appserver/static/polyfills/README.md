# Polyfills

`.es` files placed in this folder will automatically be bundled into `polyfills.js` and immediately executed on global scope on the HTML template in `base.html`. (See `entry` property of `build.config.js`).

Only files that polyfill missing browser functionality should be placed here.