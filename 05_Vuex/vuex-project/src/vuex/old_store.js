import { Vue } from "./install"
import { forEach } from "./utils"
class Store {
    constructor(options) {
        // 以下这些变量都是用户传递的
        // 用户组件中使用的$store = this
        let { state, mutations, actions, getters, modules, strict } = options

        // ----getters----
        this.getters = {} // 取getters属性时，把他代理到计算属性上
        const computed = {}
        forEach(getters, (fn, key) => {
            computed[key] = () => fn(this.state)  // 保证参数为state
            // 当我们取getters上取值，需要对computed取值
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key], // 具备缓存功能
            })
        })
        // ----mutations----
        this.mutations = {}
        forEach(mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn.call(this, this.state, payload)
        })
        // ----actions----
        // dispatch 中派发动作，里面可以有异步逻辑，更改状态都要通过commit提交
        this.actions = {}
        forEach(actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this, payload)
        })

        //  这个状态再页面渲染时需要手机对应的渲染wathcer，这样状态更新才会更新视图
        this._vm = new Vue({
            data: {
                // $开头的元素不会挂载到组件实例上，但是会挂载到_data上，减少一次代理
                $$state: state
            },
            computed
        })
    }

    get state() {
        // 依赖与vue的响应式原理
        return this._vm._data.$$state
    }
    // 利用箭头函数防止this指向问题
    dispatch = (type, payload) => {
        this.actions[type](payload)
    }
    commit = (type, payload) => {
        this.mutations[type](payload)
    }
}

export default Store