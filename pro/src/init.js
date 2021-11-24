/**
 * Vue初始化
 * @param {*} Vue 
 */

import { initState } from "./state"

// Vue的基础上做一次混合操作
export function initMixin(Vue) {
    // _业界规范，不希望被外部使用
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        // 数据初始化 watch computed props data
        initState(vm) // vm.$options.data
    }
}