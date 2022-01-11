# VueRouter路由钩子

## 钩子使用

 依次执行队列逻辑 [beforeEach beforeEnter beforeRouteEnter]

```js
router.beforeEach((to, from, next) => {
    // 全局钩子 路由钩子 组件钩子
    console.log(1, to, from)
    next()
})
router.beforeEach((to, from, next) => {
    // 全局钩子 路由钩子 组件钩子
    console.log(2, to, from)
    next()
})
```

## VueRouter的路由钩子实现

利用相关队列收集钩子，并在路由切换时依次执行队列逻辑

### VueRouter的钩子注册

```js
class VueRouter {
    constructor(options = {}) {
        // ...
        // 收集beforeEach钩子数组
        this.beforeHooks = []
    }
    // ...
    // 注册beforeEach钩子
    beforeEach(fn) {
        this.beforeHooks.push(fn)
    }
}
```

### 跳转时钩子执行

钩子顺序执行函数

```js
// 执行队列，利用index递增执行队列
function runQueue(queue, iterator, cb) {
    function step(index) {
        if (index >= queue.length) return cb()
        let hook = queue[index]
        // 第二个参数什么时间调用则走下一次
        iterator(hook, () => step(index + 1))
    }
    step(0)
}
```

transitionTo回调触发

```js
transitionTo(path, cb) {
    let record = this.router.match(path) // 匹配到后
    let route = createRoute(record, {
        path
    })
    if (path === this.current.path && route.matched.length === this.current.matched.length) return
    // 获取钩子队列
    let queue = this.router.beforeHooks
    // 
    const iterator = (hook, next) => {
        hook(route, this.current, next)
    }
    runQueue(queue, iterator, () => {
        // 钩子执行完成，执行跳转
        this.updateRoute(route)
        cb && cb()
    })
}

// 执行跳转
updateRoute(route) {
    this.current = route
    this.cb && this.cb(route)
}
```
