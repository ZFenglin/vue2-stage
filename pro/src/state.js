import { observe } from "./Observer/index"
import Watcher from "./Observer/watcher"
import { isFunction } from "./utils"


export function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, handler, options = {}) {
        options.user = true // 表示是用户自定义的watcher
        // vm,name,用户回调，用户自定义属性
        let watcher = new Watcher(this, key, handler, options)
        if (options.immediate) {
            handler(watcher.value)
        }
    }
}

/**
 * 状态初始化
 * @param {*} vm 
 */
export function initState(vm) {
    const opts = vm.$options
    // if (opts.props) {
    //     initProps()
    // }
    if (opts.data) {
        initData(vm)
    }
    // if (opts.computed) {
    //     initComputed()
    // }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

/**
 * 数据代理
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}


/**
 * data数据初始化
 * @param {*} vm 
 */
function initData(vm) { // vm.$el  vue内部会对属性进行检测，若是以$开头，则不进行代理
    let data = vm.$options.data
    // vue2会将data的所有数据进行劫持 Object.defineProperty
    data = vm._data = isFunction(data) ? data.call(vm) : data // 此时，vm和data无关，添加_data处理

    for (const key in data) {
        proxy(vm, '_data', key)
    }

    observe(data)
}

/**
 * watcher初始化
 * @param {*} vm 
 * @param {*} watch 
 */
function initWatch(vm, watch) {
    for (const key in watch) {
        let handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

/**
 * vm绑定watcher
 * @param {*} vm 
 * @param {*} key 
 * @param {*} handler 
 * @returns 
 */
function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}