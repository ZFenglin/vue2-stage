import { createMatcher } from "./create-matcher";
import Hash from "./history/hash";
import HTML5History from "./history/h5";
import install, { Vue } from "./install";

class VueRouter {
    constructor(options = {}) {
        this.mode = options.mode || 'hash'
        const routes = options.routes || []
        // 创建匹配器，给个路径，返回一个匹配结果
        // addRotues(path, component) 动态添加路由
        this.matcher = createMatcher(routes)

        // 根据模式初始化不同的路由系统，hash，history底层实现不一样，但是使用方式一样
        // hash => hash.js => push
        // history => history.js => pushState
        // base

        // 每次跳转都需要获取当前路径 this.$router.pathname

        switch (this.mode) {
            case 'hash': // location.hash
                this.history = new Hash(this)
                break;
            case 'history': // pushState
                this.history = new HTML5History(this)
                break;
        }
        this.beforeHooks = []
    }

    match(location) {
        return this.matcher.match(location)
    }

    push(location) {
        // 跳转页面
        this.history.transitionTo(location, () => {
            this.history.pushState(location)
        })
    }

    init(app) {
        const history = this.history // 当期管理路由
        // hash => hashchange 但是浏览器支持popstate，则优先采用popstate
        // history => popstate 性能高于hashchange，但是有兼容性问题

        // 页面初始化完成后进行一次跳转
        // 核心方法transitionTo，跳转至某一个路径
        const setUpListeners = () => {
            // 此事件的实现方式也不一致
            history.setUpListeners()
        }
        history.transitionTo(history.getCurrentLocation(), setUpListeners)
        history.listen((route) => {
            // 监听current变化，则_route重新赋值
            app._route = route
        })
    }
    beforeEach(fn) {
        this.beforeHooks.push(fn)
    }
}

VueRouter.install = install

export default VueRouter;

// 路由钩子的执行思路和koa => express 中间件原理的是一样的 把添加的钩子放置数组中