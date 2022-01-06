import { createMatcher } from "./create-matcher";
import install, { Vue } from "./install";

class VueRouter {
    constructor(options = {}) {
        this.mode = options.mode || 'hash'
        const routes = options.routes || []
        // 创建匹配器，给个路径，返回一个匹配结果
        // addRotues(path, component) 动态添加路由
        this.matcher = createMatcher(routes)
    }

    init(app) {
        console.log(Vue);
        console.log('init')
    }
}

VueRouter.install = install

export default VueRouter;