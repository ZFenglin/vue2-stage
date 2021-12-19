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


  extend(Vue.options.components, builtInComponents) /// keep-alive

  initUse(Vue) /// vue.use 常问
  initMixin(Vue) /// vue.mixin
  initExtend(Vue) /// vue.extend
  initAssetRegisters(Vue) /// vue.component vue.filter vue.directive
}
