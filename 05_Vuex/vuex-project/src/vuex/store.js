import { Vue } from "./install"

class Store {
    constructor(options) {
        // 用户组件中使用的$store = this
        let { state, mutations, actions, getters, modules, strict } = options
        //  这个状态再页面渲染时需要手机对应的渲染wathcer，这样状态更新才会更新视图
        this._vm = new Vue({
            data: {
                // $开头的元素不会挂载到组件实例上，但是会挂载到_data上，减少一次代理
                $$state: state
            }
        })
    }

    get state() {
        // 依赖与vue的响应式原理
        return this._vm._data.$$state
    }
}

export default Store