# render函数获取

## _init时使用$mount函数获取render挂载

pro/src/init.js

```js
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this
        vm.$options = options

        initState(vm)

        // 将数据挂载到vm.$el上
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    // 把模板转换成渲染函数 => 虚拟dom，vnode => diff算法，更新虚拟 => 产生真实dom，更新
    Vue.prototype.$mount = function(el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // 获取render函数
        if (!options.render) { // 没有render用template
            let template = options.template
            if (!template && el) { // 用户没有传入template，则从el中获取
                template = el.outerHTML // 火狐不支持outerHTML
            }
            options.render = compileToFunction(template)
        }
    }
}
```
