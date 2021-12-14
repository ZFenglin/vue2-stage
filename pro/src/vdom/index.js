import { isObject, isReservedTag } from "../utils"

export function createElement(vm, tag, data = {}, children) {
    //  如果tag是组件,则渲染组件的vnode
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined)
    } else {
        const Ctor = vm.$options.components[tag] // 获取组件的定义
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }
}
// 创建组件的虚拟节点 区分组件和元素 data.hook / componentOptions
function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {  // 如果是对象，则对对象封装一层从而让其变成函数
        Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {// 等会渲染组件时,需要调用此初始化方法
        init(vnode) {
            // 初始化组件
            // new Ctor 会触发当前组件的_init方法
            let vm = vnode.componentInstance = new Ctor({ _isComponent: true }) // new Sub 会用此选项和子组件的options合并
            vm.$mount() //  组件挂载完成后,会在vnode.componentInstance上获取$el
        }
    }
    return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, { Ctor, children })
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm, tag, data, key, children, text, componentOptions
        // ...
    }
}