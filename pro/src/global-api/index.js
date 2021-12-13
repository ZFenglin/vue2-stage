import { mergeOptions } from "../utils"

export function initGolbalApi(Vue) {
    // 存放全局配置，每个组件初始化时都会和options合并
    Vue.options = {}
    // Vue.component = {}
    // Vue.filter = {}
    // Vue.directive = {}
    Vue.mixin = function (options) {
        // 合并options
        this.options = mergeOptions(this.options, options)
        // 返回执行对象，支持链式调用
        return this
    }
}