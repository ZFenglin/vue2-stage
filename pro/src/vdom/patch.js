/**
 * 元素挂载
 * @param {*} oldVnode 
 * @param {*} vnode 
 */
export function patch(oldVnode, vnode) {
    if (!oldVnode) { //不存在el元素,则直接根据虚拟及诶但返回真实节点
        return createElm(vnode)
    }
    if (oldVnode.nodeType == 1) { // 表示为DOM真实元素
        // vnode的虚拟节点替换oldNode的真实节点
        const parentElm = oldVnode.parentNode // 找到oldNode的父节点
        let elm = createElm(vnode)  // 创建vnode的真实节点
        // 第一次生成删除oldNode的真实节点，导致后续更新时，oldNode的真实节点不存在
        parentElm.insertBefore(elm, oldVnode.nextSibling);
        parentElm.removeChild(oldVnode) // 删除oldNode

        // 返回新节点替换旧节点
        return elm
    } else {
        // 1. 标签名称不一样，则直接删除老的替换新的
        if (oldVnode.tag !== vnode.tag) {
            // 通过vnode的el属性获取真实节点，并且vnode此时为虚拟节点，需要创建成真实节点
            oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        }

        let el = vnode.el = oldVnode.el // 新节点复用老节点

        // 2. 如果两个虚拟节点是文本,则比较文本内容
        if (vnode.tag == undefined) { // 新老都是文本节点
            if (oldVnode.text !== vnode.text) {
                el.textContent = vnode.text
            }
            return
        }

        // 3. 标签一样,比较属性,用新属性和更新老节点
        patchProps(vnode, oldVnode.data)  // 属性可能有删除的情况

        // 4.子节点处理
        let oldChilren = oldVnode.children || []
        let newChildren = vnode.children || []
        if (oldChilren.length > 0 && newChildren.length > 0) { // 双发都有儿子
            // vue利用了双指针比较儿子, 并且只进行同级比较
            patchChildren(el, oldChilren, newChildren)
        } else if (newChildren.length > 0) { //老的没儿子,新的有儿子
            // 直接在旧节点循环创建新节点
            for (let i = 0; i < newChildren.length; i++) {
                let child = createElm(newChildren[i])
                el.appendChild(child)
            }
        } else if (oldChilren.length > 0) { //老的有儿子,新的没儿子
            // 直接清空老节点
            el.innerHTML = ''
        }
    }

    // vue的特点是每个组件一个watcher,当组件中数据发生变化则组件更新
}

/**
 * 是否是相同节点
 * @param {*} oldVnode 
 * @param {*} newVnode 
 * @returns 
 */
function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

/**
 * 子节点比较
 * @param {*} el 
 * @param {*} oldChilren 
 * @param {*} newChildren 
 */
function patchChildren(el, oldChilren, newChildren) {
    let oldStartIdx = 0
    let oldStarVnode = oldChilren[0]
    let oldEndIdx = oldChilren.length - 1
    let oldEndVnode = oldChilren[oldEndIdx]

    let newStartIdx = 0
    let newStartVnode = newChildren[0]
    let newEndIdx = newChildren.length - 1
    let newEndVnode = newChildren[newEndIdx]

    // 同时循环新老节点一方循环完成就结束
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isSameVnode(oldStarVnode, newStartVnode)) { // 旧头新头比较,标签一致
            patch(oldStarVnode, newStartVnode)
            oldStarVnode = oldChilren[++oldStartIdx]
            newStartVnode = newChildren[++newStartIdx]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 旧尾新尾比较,标签一致
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChilren[--oldEndIdx]
            newEndVnode = newChildren[--newEndIdx]
        } else if (isSameVnode(oldStarVnode, newEndVnode)) { // 旧头新尾比较,标签一致 (reverse)
            patch(oldStarVnode, newEndVnode)
            el.insertBefore(oldStarVnode.el, oldEndVnode.el.nextSibling) // 移动元素老的元素就移动走了
            oldStarVnode = oldChilren[++oldStartIdx]
            newEndVnode = newChildren[--newEndIdx]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 旧尾新头比较,标签一致
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStarVnode.el)
            oldEndVnode = oldChilren[--oldEndIdx]
            newStartVnode = newChildren[++newStartIdx]
        }
    }
    // 没有比对完的,则直接添加到父节点尾部中
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            // insertBefore它可以实现appendChild的功能 insertBefore(节点,null)
            // 看一下尾指针的下一个节点是否为null,如果为null,则直接appendChild
            let achor = newChildren[newEndIdx + 1] == null ? null : newChildren[newEndIdx + 1].el
            el.insertBefore(createElm(newChildren[i]), achor)
        }
    }
    // 旧元素没有比对完的,则直接删除
    if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            el.removeChild(oldChilren[i].el)
        }
    }
}

/**
 * 属性比较
 * @param {*} vnode 
 * @param {*} oldProps 
 */
function patchProps(vnode, oldProps = {}) {  // 初次渲染时和后续更新都可以调用

    let newProps = vnode.data || {}
    let el = vnode.el
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    // 如果老的有,新的没有,则删除老的
    for (let key in oldStyle) {
        if (!newStyle[key]) { //新的不存在这个样式
            el.style[key] = ''
        }
    }
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    // 直接新的生成到于元素上
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newStyle) {
                el.style[styleName] = newStyle[styleName]
            }
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

/**
 * 创建组件真实节点
 * @param {*} vnode 
 * @returns 
 */
function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) { // 向data上获取init属性
        i(vnode) // 调用init方法
    }
    if (vnode.componentInstance) { // 判断是否存在componentInstance属性, 存在则说明子组件new完成了,并且组件对应的真实节点为vnode.componentInstance.$el
        return true
    }
}

/**
 * 虚拟节点转化为真实节点
 * @param {*} vnode 
 * @returns 
 */
export function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof vnode.tag === 'string') { // 元素
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag) // 虚拟节点存在el属性对应它的真实节点
        patchProps(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}