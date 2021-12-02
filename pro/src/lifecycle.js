export function lifecycleMixin(Vue) {
    // 定义生命周期函数
    Vue.prototype._update = function (vnode) {
        console.log('_update 处理元素更新挂载', vnode);
    }
}

export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用
    let updateComponent = () => {
        // 调用render函数，生成虚拟dom
        vm._update(vm._render()) // 最核心代码， 后于更新可以调用updateComponent
        // 用虚拟dom渲染真实dom
    }
    updateComponent()
}
