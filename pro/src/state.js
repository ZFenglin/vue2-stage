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

function initData(vm) {
    let data = vm.$options.data
    // vue2会将data的所有数据进行劫持 Object.defineProperty
    data = vm._data = isFunction(data) ? data.call(vm) : data // 此时，vm和data无关，添加_data处理
    observe(data)
}