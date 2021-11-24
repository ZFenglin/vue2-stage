import { initMixin } from "./init"

// 构造函数模拟class
function Vue(options) {
  // options 为用户传入的选项
  this._init(options) // 初始化操作 作为原型方法，所有共用
}

// Vue原型扩展
initMixin(Vue)

export default Vue