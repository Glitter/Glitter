/* eslint-disable */
// https://stackoverflow.com/a/53074814
// Used for loading the widgets at run-time, hack required to avoid webpack
// trying to require them at build time
module.exports =
  // eslint-disable-next-line
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
