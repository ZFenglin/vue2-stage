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

    transitionTo(path, cb) {
        let record = this.router.match(path) // 匹配到后
        this.current = createRoute(record, { path })

        // 路径变化需要渲染组件，利用响应式原理，将current变成响应式，后续更改current就能渲染组件了
        // Vue.util.defineReactive(this.current, 'path', path)
        // 可以在router-view中使用current属性，如果路径变化就可以更新视图了

        cb && cb() // 默认第一次是hashchange或popState监听注册
    }
}