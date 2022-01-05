import { Vue } from "./install"
import ModuleCollection from "./module/module-collection"
import { forEach } from "./utils"

// [a, b, c]
function installModule(store, rootState, path, module) {
    let ns = store._modules.getNamespace(path)
    // module.state => 放到rootState的儿子里
    if (path.length > 0) {// 儿子模块
        // 找到对应父模块，将状态声明上去
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        // 对象新增属性不能导致重新更新视图
        Vue.set(parent, path[path.length - 1], module.state)
    }

    // 需要循环当前模块的
    module.forEachGetter((fn, key) => {
        store.wrapperGetter[ns + key] = function () {
            return fn.call(store, module.state)
        }
    })
    module.forEachMutation((fn, key) => {
        store.mutations[ns + key] = store.mutations[ns + key] || []
        store.mutations[ns + key].push((payload) => {
            return fn.call(store, module.state, payload)
        })

    })
    module.forEachAction((fn, key) => {
        store.actions[ns + key] = store.actions[ns + key] || []
        store.actions[ns + key].push((payload) => {
            return fn.call(store, store, payload)
        })
    })
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })

}

class Store {
    constructor(options) {
        // 对用户模块进行整合
        this._modules = new ModuleCollection(options) // 对用户参数进行格式化操作
        this.wrapperGetter = {}
        this.mutations = {}
        this.actions = {}
        this.getters = {}
        const computed = {}

        // 没有namespaced，则getters都放在根上，action和mutations则会合并为数组
        // 安装模块
        let state = options.state
        installModule(this, state, [], this._modules.root)

        forEach(this.wrapperGetter, (getter, key) => {
            computed[key] = getter
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
        })

        this._vm = new Vue({
            data: {
                $$data: state
            },
            computed
        })
    }
    get state() {
        return this._vm._data.$$data
    }
    commit = (mutationName, payload) => { // 发布订阅
        this.mutations[mutationName] && this.mutations[mutationName].forEach(fn => fn(payload))
    }

    dispatch = (actionName, payload) => {
        this.actions[actionName] && this.actions[actionName].forEach(fn => fn(payload))
    }
}

export default Store