# VUEX严格模式

store中strict设置为true则只允许在commit中修改state

## Store处理

```js
class Store {
    constructor(options) {
        // ...
        // 默认不是在mutation中更改
        this._committing = false
        this.strict = options.strict
        // ...
    }
    // ...
    // 处理
    _withCommitting(fn) {
        this._committing = true
        fn() // 函数是同步的，如果是异步的就会编程false
        this._committing = false
    }
    replaceState(newState) {
        // _withCommitting包裹防止触发监听回调
        this._withCommitting(() => {
            this._vm._data.$$state = newState
        })
    }
    // ...
}
```

## installModule处理

installModule

```js
function installModule(store, rootState, path, module) {
    let ns = store._modules.getNamespace(path)
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        // _withCommitting包裹防止触发监听回调
        store._withCommitting(() => {
            Vue.set(parent, path[path.length - 1], module.state)
        })
    }
    // ...
    module.forEachMutation((fn, key) => {
        store.mutations[ns + key] = store.mutations[ns + key] || []
        store.mutations[ns + key].push((payload) => {
            let res
            // _withCommitting包裹防止触发监听回调
            store._withCommitting(() => {
                res = fn.call(store, getNewState(store, path), payload)
            })
            store._subscribes.forEach(fn => fn({
                type: ns + key,
                payload
            }, store.state))
            return res
        })

    })
    // ...
}
```

## store严格模式监听设置

```js
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
    // store严格模式监听设置
    if (store.strict) {
        // 说明是严格模式， 原则上是异步执行
        store._vm.$watch(() => store._vm._data.$$state, () => {
            // 我希望状态变化后，直接能监控到，watcher都是异步的
            // 状态变化会立即执行，不是异步
            console.assert(store._committing, 'no mutate on mutation handler outside')
        }, {
            deep: true,
            sync: true
        })
    }

    if (oldVm) {
        Vue.nextTick(() => oldVm.$destroy())
    }
}
```
