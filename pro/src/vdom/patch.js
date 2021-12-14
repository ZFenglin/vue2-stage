/**
 * 元素挂载
 * @param {*} oldNode 
 * @param {*} vnode 
 */
export function patch(oldNode, vnode) {
    if (!oldNode) { //不存在el元素,则直接根据虚拟及诶但返回真实节点
        return createElm(vnode)
    }
    if (oldNode.nodeType == 1) {
        // vnode的虚拟节点替换oldNode的真实节点
        const parentElm = oldNode.parentNode // 找到oldNode的父节点
        let elm = createElm(vnode)  // 创建vnode的真实节点
        // 第一次生成删除oldNode的真实节点，导致后续更新时，oldNode的真实节点不存在
        parentElm.insertBefore(elm, oldNode.nextSibling);
        parentElm.removeChild(oldNode) // 删除oldNode

        // 返回新节点替换旧节点
        return elm
    }
}

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
function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof vnode.tag === 'string') { // 元素
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag) // 虚拟节点存在el属性对应它的真实节点
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}