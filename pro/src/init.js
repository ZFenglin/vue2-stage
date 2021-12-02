/**
 * Vue初始化
 * @param {*} Vue 
 */

import { compileToFunction } from "./Compiler/index"
import { mountComponent } from "./lifecycle"
import { initState } from "./state"

// Vue的基础上做一次混合操作
export function initMixin(Vue) {
    // _业界规范，不希望被外部使用
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options // 将用户传入的选项保存在vm.$options中

        // 数据初始化 watch computed props data
        initState(vm) // vm.$options.data

        if (vm.$options.el) {
            vm.$mount(vm.$options.el) // 将数据挂载到vm.$el上
        }
    }
    // 把模板转换成渲染函数 => 虚拟dom，vnode => diff算法，更新虚拟 => 产生真实dom，更新
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // 获取render函数
        if (!options.render) { // 没有render用template
            let template = options.template
            if (!template && el) { // 用户没有传入template，则从el中获取
                template = el.outerHTML // 火狐不支持outerHTML
            }
            options.render = compileToFunction(template)
        }
        // 将vm挂载到el上
        mountComponent(vm, el)
    }
}

