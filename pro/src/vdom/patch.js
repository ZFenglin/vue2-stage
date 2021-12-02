/**
 * 元素挂载
 * @param {*} oldNode 
 * @param {*} vnode 
 */
export function patch(oldNode, vnode) {
    if (oldNode.nodeType == 1) {
        // vnode的虚拟节点替换oldNode的真实节点
        const parentElm = oldNode.parentNode // 找到oldNode的父节点
        let elm = createElm(vnode)  // 创建vnode的真实节点
        parentElm.insertBefore(elm, oldNode.nextSibling);
        parentElm.removeChild(oldNode) // 删除oldNode
    }
}

/**
 * 虚拟节点转化为真实节点
 * @param {*} vnode 
 * @returns 
 */
function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
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