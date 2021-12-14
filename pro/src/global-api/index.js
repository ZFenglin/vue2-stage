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

    Vue.options._base = Vue // 无论之后创建多少子类，都可以获取到基类
    Vue.options.components = {}
    Vue.component = function (id, definition) {
        // 保证组件隔离， 每个组件都会产生新的类，去继承父类
        definition = this.options._base.extend(definition)
        this.options.components[id] = definition
    }
    Vue.extend = function (definition) { // extend方法就是产生Vue的子类，同时具有父类上所有功能
        const Super = this
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        // 原型继承
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        // 合并options，之和Vue的options合并
        Sub.options = mergeOptions(Super.options, definition)
        return Sub
    }
}