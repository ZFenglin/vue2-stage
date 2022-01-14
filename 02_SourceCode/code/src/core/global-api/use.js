/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  // /// 为了给Vue扩展功能，希望扩展的时候使用的vue版本一致
  // plugin.install = function(Vue,optoins,a,b,c){
  // }
  // Vue.use(plugin,options,a,b,c)

  /// Vue.use使用插件的
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this /// 如果插件安装过，直接返回
    }

    // additional parameters
    const args = toArray(arguments, 1) /// Array.from(arguments).slice(1) 除了第一项的参数的其他整合为数组
    args.unshift(this) /// [Vue.options,a,b,c] // 将Vue放入数组中
    if (typeof plugin.install === 'function') {// 调用install方法
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') { // 直接调用方法
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin) // 缓存插件
    return this
  }
}
