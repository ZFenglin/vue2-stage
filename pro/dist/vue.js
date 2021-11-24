(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var a = 2;
  console.log(a);

  for (var _a = 0; _a < 3; _a++) {
    console.log(_a);
  }

  return a;

}));
//# sourceMappingURL=vue.js.map
