import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

/// complier可以直接使用render函数，但是不能用template，.vue的template靠vue-loader处理

initGlobalAPI(Vue) /// 初始化Vue的全局API

// Object.defineProperty(Vue.prototype, '$isServer', {
//   get: isServerRendering
// })

// Object.defineProperty(Vue.prototype, '$ssrContext', {
//   get() {
//     /* istanbul ignore next */
//     return this.$vnode && this.$vnode.ssrContext
//   }
// })

// // expose FunctionalRenderContext for ssr runtime helper installation
// Object.defineProperty(Vue, 'FunctionalRenderContext', {
//   value: FunctionalRenderContext
// })

Vue.version = '__VERSION__'

export default Vue
