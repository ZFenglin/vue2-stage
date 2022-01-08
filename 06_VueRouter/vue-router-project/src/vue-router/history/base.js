// 路由公共的方法

function createRoute(record, location) { // 创建路由
    const matched = []
    // 不停的去父级查找
    if (record) {
        while (record) {
            matched.unshift(record)
            record = record.parent
        } // /aboult/a => [about, about-a]
    }
    return {
        ...location,
        matched,
    }
}

export default class History {
    constructor(router) {
        this.router = router;
        // 有一个数据来保存路径的变化
        this.current = createRoute(null, {
            path: '/'
        })
    }

    listen(cb) {
        this.cb = cb // 保存当前cb
    }

    transitionTo(path, cb) {
        let record = this.router.match(path) // 匹配到后
        // 更新current需要重新渲染视图
        let route = createRoute(record, { path })
        // 如果两次路由一致，停止跳转
        // 1. 保证当前路径一致
        // 2. 匹配记录的个数应该一致
        if (path === this.current.path && route.matched.length === this.current.matched.length) return
        this.current = route
        // 路径变化需要渲染组件，利用响应式原理，将current变成响应式，后续更改current就能渲染组件了
        // Vue.util.defineReactive(this.current, 'path', path)
        // 可以在router-view中使用current属性，如果路径变化就可以更新视图了
        this.cb && this.cb(route)
        cb && cb() // 默认第一次是hashchange或popState监听注册
    }
}