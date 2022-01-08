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
    }

    match(location) {
        return this.matcher.match(location)
    }

    push(loaction) {
        // 跳转页面
        this.history.transitionTo(loaction, () => {
            // 对应 h5
            // pushState

            window.location.hash = loaction // 更改hash值
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
}

VueRouter.install = install

export default VueRouter;