import { createElement, createTextElement } from "./vdom/index"

export function renderMixin(Vue) {
    Vue.prototype._c = function (tag, data, children) { // 创建元素 createElement
        return createElement(this, tag, data, children)
    }
    Vue.prototype._v = function (text) { // 创建文本节点 createTextElement
        return createTextElement(this, text)
    }
    Vue.prototype._s = function (value) {
        return typeof value === 'string' ? value : JSON.stringify(value)
    }


    Vue.prototype._render = function () {
        const vm = this
        let render = vm.$options.render // 我们自己解析的||用户自己写的
        let vnode = render.call(vm)
        return vnode
    }
}