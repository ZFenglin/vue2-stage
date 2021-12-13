import Watcher from "./Observer/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    // 定义生命周期函数
    Vue.prototype._update = function (vnode) {
        // 既有初始化，也有更新
        const vm = this
        // 更新旧的节点
        vm.$el = patch(vm.$el, vnode)
    }

    Vue.prototype.$nextTick = nextTick
}

// 后续每个组件渲染时都会有个watcher
export function mountComponent(vm, el) {
    callHook(vm, "beforeMount")
    // 更新函数 数据变化后 会再次调用
    let updateComponent = () => {
        // 调用render函数，生成虚拟dom
        vm._update(vm._render()) // 最核心代码， 后于更新可以调用updateComponent
        // 用虚拟dom渲染真实dom
    }

    // 观察者模式: 属性=>被观察者  刷新页面=>观察者
    // updateComponent()
    new Watcher(vm, updateComponent, () => { }, true) //true表示为 渲染watcher 后续有其他的watcher
}

// 生命周期钩子
export function callHook(vm, hook) {
    let handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(handler => {
            handler.call(vm)
        })
    }
}