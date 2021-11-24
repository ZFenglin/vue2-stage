import { observe } from "./Observer/index"
import { isFunction } from "./utils"

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
function initData(vm) {
    let data = vm.$options.data
    // vue2会将data的所有数据进行劫持 Object.defineProperty
    data = vm._data = isFunction(data) ? data.call(vm) : data // 此时，vm和data无关，添加_data处理

    for (const key in data) {
        proxy(vm, '_data', key)
    }

    observe(data)
}