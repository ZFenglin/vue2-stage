/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = { /// vue内部的工具方法
    warn,
    extend,
    mergeOptions, /// 合并选项
    defineReactive
  }

  Vue.set = set /// vue.set
  Vue.delete = del /// vue.delete
  Vue.nextTick = nextTick /// vue.nextTick

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj) /// 监控对象
    return obj
  }
  /// 用户自定义的全局属性 方法 component directive filter
  /// Vue.mixin({data,hook}) 数据来源不清晰，好处是可以复用（高阶组件），但是不推荐使用
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    /// vue.options.components.xx = xx
    /// vue.options.filters.xx = xx
    /// vue.options.defaults.xx = xx
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue /// vue创建函数实例

  /// keep-alive是全局组件 Vue.component Vue.options.component 默认初始化全局API，会构建keep-alive组件
  extend(Vue.options.components, builtInComponents) /// keep-alive 处理

  initUse(Vue) /// vue.use 常问
  initMixin(Vue) /// vue.mixin => mergeOptions
  initExtend(Vue) /// vue.extend
  initAssetRegisters(Vue) /// vue.component vue.filter vue.directive
}
