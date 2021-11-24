(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 工具
   */

  /**
   * 是否是函数判断
   * @param {*} val 
   */
  function isFunction(val) {
    return typeof val === 'function';
  }
  /**
   * 是否是对象判断
   * @param {*} val 
   */

  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  /**
   * 监测数据
   * 使用class可以添加类型，方便检查
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 对对象中的所有属性进行劫持
      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 对象
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); // vue2会对对象进行遍历，对每个属性重新定义，性能差


  function defineReactive(data, key, value) {
    observe(value); // 对象套对象，则需要遍历（性能差）

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        observe(newVal); // 当用户设置新对象，则对这个对象进劫持

        value = newVal;
      }
    });
  }

  function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
      return;
    } // 默认最外层的data必须是个对象


    return new Observer(data);
  }

  /**
   * 状态初始化
   * @param {*} vm 
   */

  function initState(vm) {
    var opts = vm.$options; // if (opts.props) {
    //     initProps()
    // }

    if (opts.data) {
      initData(vm);
    } // if (opts.computed) {
    //     initComputed()
    // }
    // if (opts.watch) {
    //     initWatch()
    // }

  }
  /**
   * 数据代理
   * @param {*} vm 
   * @param {*} source 
   * @param {*} key 
   */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }
  /**
   * data数据初始化
   * @param {*} vm 
   */


  function initData(vm) {
    var data = vm.$options.data; // vue2会将data的所有数据进行劫持 Object.defineProperty

    data = vm._data = isFunction(data) ? data.call(vm) : data; // 此时，vm和data无关，添加_data处理

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  /**
   * Vue初始化
   * @param {*} Vue 
   */

  function initMixin(Vue) {
    // _业界规范，不希望被外部使用
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 数据初始化 watch computed props data

      initState(vm); // vm.$options.data
    };
  }

  function Vue(options) {
    // options 为用户传入的选项
    this._init(options); // 初始化操作 作为原型方法，所有共用

  } // Vue原型扩展


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
