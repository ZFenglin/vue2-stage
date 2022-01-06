import RouterLink from "./components/link"
import RouterView from "./components/view"

export let Vue // 保持使用的Vue的版本和VueRouter使用的Vue一致

export default function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            // 给root实例增加_router属性，所有组件从这里取
            if (this.$options.router) {
                // 根组件
                this._router = this.$options.router
                this._routerRoot = this // 根组件上有一个唯一表示叫_routerRoot指向自己

                // 初始化路由逻辑，放这里只初始化一次
                this._router.init(this) // 整个应用的根
            } else {
                // 子组件
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
            // 所有组件都有_routerRoot属性，可以访问到根组件
        }
    })
    // _routerRoot 是根实例， 根实例上有_router属性
    // 给所有的组件都添加$router属性和$route属性
    Object.defineProperty(Vue.prototype, '$router', {
        get() { }
    })
    Object.defineProperty(Vue.prototype, '$route', {
        get() { }
    })
    Vue.component('router-link', RouterLink)
    Vue.component('router-view', RouterView)
}
