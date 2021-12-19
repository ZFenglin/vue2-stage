# 虚拟DOM转化为真实DOM

## 添加$el属性

在$mount时为实例vm增加el属性，指向真实DOM

```JavaScript
    Vue.prototype.$mount = function(el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el // 实例的$el属性指向真实dom，用于后续更新
        // render函数获取 ...
        // 将vm挂载到el上
        mountComponent(vm, el)
    }
```

## 完善update函数

处理_upadte_函数，将元素的真实DOM vm.$el 和处理后的vnode传给patch用于挂载更新

```JavaScript
import {
    patch
} from "./vdom/patch"

export function lifecycleMixin(Vue) {
    // 定义生命周期函数
    Vue.prototype._update = function(vnode) {
        // 既有初始化，也有更新
        const vm = this
        patch(vm.$el, vnode)
    }
}
```

## patch处理元素更新挂载

### 创建节点函数

将传入的vnode对象通过 document.createElement处理获取真实DOM
并将真实DOM赋值给vnode.el

```JavaScript
/**
 * 虚拟节点转化为真实节点
 * @param {*} vnode 
 * @returns 
 */
function createElm(vnode) {
    let {
        tag,
        data,
        children,
        text,
        vm
    } = vnode
    if (typeof vnode.tag === 'string') {
        vnode.el = document.createElement(tag) // 虚拟节点存在el属性对应它的真实节点
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
```

### 挂载元素

获取真实DOM的父元素
将生成的元素作为兄弟元素添加到父元素中
删除目标元素

```JavaScript
/**
 * 元素挂载
 * @param {*} oldNode 
 * @param {*} vnode 
 */
export function patch(oldNode, vnode) {
    if (oldNode.nodeType == 1) {
        // vnode的虚拟节点替换oldNode的真实节点
        const parentElm = oldNode.parentNode // 找到oldNode的父节点
        let elm = createElm(vnode) // 创建vnode的真实节点
        parentElm.insertBefore(elm, oldNode.nextSibling);
        parentElm.removeChild(oldNode) // 删除oldNode
    }
}
```
