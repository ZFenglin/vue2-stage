import { Vue } from "./install"
import ModuleCollection from "./module/module-collection"
import { forEach } from "./utils"

// 设置新状态
function getNewState(store, path) {
    let res = path.reduce((memo, current) => {
        return memo[current]
    }, store.state)
    return res
}

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
        store._withCommitting(() => {
            Vue.set(parent, path[path.length - 1], module.state)
        })
    }

    // 需要循环当前模块的
    module.forEachGetter((fn, key) => {
        store.wrapperGetter[ns + key] = function () {
            return fn.call(store, getNewState(store, path))
        }
    })
    module.forEachMutation((fn, key) => {
        store.mutations[ns + key] = store.mutations[ns + key] || []
        store.mutations[ns + key].push((payload) => {
            let res
            store._withCommitting(() => {
                res = fn.call(store, getNewState(store, path), payload)
            })
            store._subscribes.forEach(fn => fn({ type: ns + key, payload }, store.state))
            return res
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

function restoreVM(store, state) {
    let oldVm = store._vm
    store.getters = {}
    const computed = {}
    forEach(store.wrapperGetter, (getter, key) => {
        computed[key] = getter
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        })
    })

    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })

    if (store.strict) {
        // 说明是严格模式， 原则上是异步执行
        store._vm.$watch(() => store._vm._data.$$state, () => {
            // 我希望状态变化后，直接能监控到，watcher都是异步的
            // 状态变化会立即执行，不是异步
            console.assert(store._committing, 'no mutate on mutation handler outside')
        }, { deep: true, sync: true })
    }

    if (oldVm) {
        // 重新创建实例后，需要将老的实例卸载掉
        Vue.nextTick(() => oldVm.$destroy())
    }
}

class Store {
    constructor(options) {
        // 对用户模块进行整合
        this._modules = new ModuleCollection(options) // 对用户参数进行格式化操作
        this.wrapperGetter = {}
        this.mutations = {}
        this.actions = {}
        this._subscribes = []
        this._committing = false // 默认不是在mutation中更改
        this.strict = options.strict

        // 没有namespaced，则getters都放在根上，action和mutations则会合并为数组
        // 安装模块
        let state = options.state
        installModule(this, state, [], this._modules.root)
        restoreVM(this, state);
        if (options.plugins) {
            // 使用插件默认执行
            options.plugins.forEach(plugin => plugin(this))
        }
    }
    get state() {
        return this._vm._data.$$state
    }
    commit = (mutationName, payload) => { // 发布订阅
        this.mutations[mutationName] && this.mutations[mutationName].forEach(fn => fn(payload))
    }

    dispatch = (actionName, payload) => {
        this.actions[actionName] && this.actions[actionName].forEach(fn => fn(payload))
    }
    _withCommitting(fn) {
        this._committing = true
        fn() // 函数是同步的，如果是异步的就会编程false
        this._committing = false
    }
    subscribe(fn) {
        this._subscribes.push(fn)
    }
    replaceState(newState) {
        this._withCommitting(() => {
            // 需要替换的状态
            this._vm._data.$$state = newState //  赋予新的状态，会被重新劫持
            // 虽然替换了状态，但是mutation getter中的state初始化的时候还是之前的状态
        })

    }
    registerModule(path, module) {
        if (typeof path === 'string') path = [path];

        this._modules.register(path, module); // 模块的注册，将用户的数据放到树中
        // 注册完毕后字啊进行安装
        // 将用户的module转化的newModule传入
        installModule(this, this.state, path, module.newModule)

        // vuex内部重新注册会重新创建实例，虽然重新安装了，只解决的状态的问题，但是computed就丢失了
        restoreVM(this, this.state);
    }
}

export default Store