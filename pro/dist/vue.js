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

  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype); // arrayMethods.__proto__ = Array.prototype 继承获取属性方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    // 用户调用时，如果用以上的方法，则用重写的，否则用原生的
    arrayMethods[method] = function () {
      console.log('数组变化了');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      oldArrayPrototype[method].apply(this, args); // 执行原生的方法
      // arr.push({a: 1},{a: 2},{a: 3}) push对象也需要处理，则方法中需要对新增对象进行劫持

      var inserted; // 新增的对象

      var ob = this.__ob__; // 获取当前数组的Observer实例，为了后面使用observeArray方法

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2); // 只取splice中的新增对象

          break;
      } // 如果有新增对象，则需要对新增的对象进行劫持，需要观测数组每一项，而不是数组本身


      if (inserted) ob.observeArray(inserted);
    };
  });

  /**
   * 监测数据
   * 使用class可以添加类型，方便检查
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      Object.defineProperty(data, '__ob__', {
        value: this,
        // 所有被劫持的属性都具有__ob__属性，这个属性是一个Observer实例
        enumerable: false // 设置为false，不可枚举，注意循环引用的时候，不能被遍历到

      });

      if (Array.isArray(data)) {
        // 数组劫持处理
        // 对数组方法进行改写 切片编程 高阶函数
        data.__proto__ = arrayMethods; // 如果数组中数据是对象, 那么也要进行监测

        this.observeArray(data);
      } else {
        // 对象劫持处理
        this.walk(data);
      }
    } // 数组中数组和对象劫持
    // 虽然数组没监听索引，但是其中的对象会进行处理，可以使用Object.freeze() 冻结对象


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      } // 对象劫持

    }, {
      key: "walk",
      value: function walk(data) {
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
        console.log('get:' + key);
        return value;
      },
      set: function set(newVal) {
        console.log('set:' + key);
        observe(newVal); // 当用户设置新对象，则对这个对象进劫持

        value = newVal;
      }
    });
  }

  function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
      return;
    } // 如果已经被劫持过了，就不再劫持


    if (data.__ob__) {
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
    // vm.$el  vue内部会对属性进行检测，若是以$开头，则不进行代理
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
