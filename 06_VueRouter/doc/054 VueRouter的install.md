# VueRouter的install

## install处理

混入beforeCreate，为根组件和其他所有的子组件添加_routerRoot用于获取根组件实例

Vue的prototype属性中添加$router和$route

注册全局的link和view组件

```js
import RouterLink from "./components/link"
import RouterView from "./components/view"

export let Vue // 保持项目和VueRouter使用的Vue实例一致

export default function install(_Vue) {
    // 同步Vue实例
    Vue = _Vue

    // 混入处理
    Vue.mixin({
        beforeCreate() {
            // 所有组件都有_routerRoot属性，可以访问到根组件，同时根组件会进行初始化
            if (this.$options.router) {
                // $options存在router，则表示为根组件
                this._router = this.$options.router
                this._routerRoot = this
                // 初始化路由逻辑(只执行一次)
                this._router.init(this)
            } else {
                // 子组件，将_routerRoot设置为父组件的_routerRoot
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
        }
    })

    // 给所有的组件都添加$router属性和$route属性
    Object.defineProperty(Vue.prototype, '$router', { // 方法
        get() {
            return this._routerRoot._router
        }
    })
    Object.defineProperty(Vue.prototype, '$route', { // 属性
        get() {
            return this._routerRoot._route
        }
    })

    // 设置VueRouter的组件
    Vue.component('router-link', RouterLink)
    Vue.component('router-view', RouterView)
}
```

## VueRouter设置

添加VueRouter类，用处对路由进行创建

```JS
import {
    createMatcher
} from "./create-matcher";
import install, {
    Vue
} from "./install";

class VueRouter {
    constructor(options = {}) {
        // 获取模式
        this.mode = options.mode || 'hash'
        // 获取路由表
        const routes = options.routes || []
        // 创建匹配器，给个路径，返回一个匹配结果
        this.matcher = createMatcher(routes)
    }
    init(app) {
        // 初始化路由逻辑
        // ...
    }
}

// VueRouter增加静态方法install
VueRouter.install = install

export default VueRouter;
```
