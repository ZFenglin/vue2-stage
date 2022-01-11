# VueRouter的hash处理

## 路由映射表生成方法

在路由实例创建时，createMatcher用于生成路由映射表，并返回两个接口函数

```js
import {
    createRouteMap
} from "./create-route-map"

export function createMatcher(routes) {
    // 映射表生成
    let {
        pathMap
    } = createRouteMap(routes)
    // 增加路由接口
    function addRoutes(routes) {
        // 将新的路由添加到路由表pathMap中
        createRouteMap(routes, pathMap)
    }
    // 匹配路由接口
    function match(path) {
        return pathMap[path]
    }
    // 只返回对应接口，映射表不返回
    return {
        addRoutes,
        match
    }
}
```

路由通过createRouteMap将options转化为路由映射表

```js
// 创建路由映射表
export function createRouteMap(routes, oldPathMap) {
    // oldPathMap存在，则进行新旧合并
    let pathMap = oldPathMap || Object.create(null)
    routes.forEach(route => {
        addRouteRecord(route, pathMap)
    });
    return {
        pathMap
    }
}

// 添加路由记录
function addRouteRecord(route, pathMap, parent) {
    // 存在父亲则在路由上添加父亲的path
    let path = parent ? `${parent.path}/${route.path}` : route.path
    // 创建对应记录
    let record = {
        path: path,
        component: route.component,
        props: route.props || {},
        parent: parent,
    }
    // 设置到映射表中
    pathMap[path] = record
    // 存在子路径则递归调用并传入当前record
    route.children && route.children.forEach(childRoute => {
        addRouteRecord(childRoute, pathMap, record)
    })
}
```

## VueRouter模式区分

根据模式初始化不同的路由系统

hash => hashchange 但是浏览器支持popstate，则优先采用popstate
history => popstate 性能高于hashchange，但是有兼容性问题

```js
class VueRouter {
    constructor(options = {}) {
        this.mode = options.mode || 'hash'
        const routes = options.routes || []
        this.matcher = createMatcher(routes)
        // 根据模式初始化不同的路由系统，hash，history底层实现不一样，但是使用方式一样
        // hash => hash.js => push
        // history => history.js => pushState
        // base
        switch (this.mode) {
            case 'hash': // location.hash
                this.history = new Hash(this)
                break;
            case 'history': // pushState
                this.history = new HTML5History(this)
                break;
        }
    }
    // 匹配路由获取
    match(location) {
        return this.matcher.match(location)
    }
    // 初始化
    init(app) {
        // 当前管理路由
        const history = this.history
        // 页面初始化完成后进行一次跳转
        const setUpListeners = () => {
            history.setUpListeners()
        }
        // 跳转至当前地址
        history.transitionTo(history.getCurrentLocation(), setUpListeners)
    }
}
```

## 两种模式设置

base基本类，处理两种模式的共同部分，用于模式的继承

```js
function createRoute(record, location) {
    const matched = []
    if (record) {
        // 路由映射存在，将该路径的父路由record都添加至matched中
        // /aboult/a => [about, about-a]
        while (record) {
            matched.unshift(record)
            record = record.parent
        }
    }
    return {
        ...location,
        matched,
    }
}

export default class History {
    constructor(router) {
        this.router = router;
        // 初始化值
        this.current = createRoute(null, {
            path: '/'
        })
    }

    transitionTo(path, cb) {
        // 调用传入路由实例的match，获取匹配的record
        let record = this.router.match(path)
        // 变更current路由
        this.current = createRoute(record, {
            path
        })

        // 路径变化需要渲染组件，利用响应式原理，将current变成响应式，后续更改current就能渲染组件了
        // Vue.util.defineReactive(this.current, 'path', path)
        // 可以在router-view中使用current属性，如果路径变化就可以更新视图了

        // 回调执行
        cb && cb()
    }
}
```

hash处理

```js
import History from "./base";

function ensurehash() {
    // 如果当前地址不是以#开头，则添加#
    if (!window.location.hash) {
        window.location.hash = '/'
    }
}

function getHash() {
    return window.location.hash.slice(1)
}
export default class Hash extends History {
    constructor(router) {
        super(router);
        ensurehash();
    }
    // 获取当前地址
    getCurrentLocation() {
        return getHash()
    }
    // 设置变化监听
    setUpListeners() {
        window.addEventListener('hashchange', () => {
            // hash值变化后，再去切换组件并渲染
            this.transitionTo(getHash())
        })
    }
}
```

h5暂时不处理
