export default {
    functional: true,
    render(h, { parent, data }) { // current = {matched:[]}
        // 内部current替换成响应式
        // 正真用的是$route
        let route = parent.$route
        // 一次将match的结果赋予给每个router-view
        // 父 => 子
        let depth = 0
        while (parent) { // 1. 需要是组件
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
        let record = route.matched[depth]
        if (!record) {
            return h() //空
        }
        data.routerView = true
        return h(record.component, data)
    }
}