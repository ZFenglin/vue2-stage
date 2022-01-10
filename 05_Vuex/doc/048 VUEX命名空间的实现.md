# VUEX命名空间实现

## 命名空间使用

在确定的模块中增加namespaced属性

没有namespaced，则gtters都会被定义到父模块上，mutations和action会被合并在一起

```js
modules: {
    a: {
        namespaced: true, // 命名空间, 解决名称冲突问题
        state: {
            name: 't1',
            age: 10
        },
        getters: {
            myAge(state) { // 重名会重叠
                return state.age + 20
            }
        },
        mutations: { // 同名内外同步更改
            changeAge(state, payload) {
                state.age += payload
            }
        },
    },
}
```

## Moudle处理

Moudle增加命名空间属性获取namespaced接口，返回传入的options的namespaced属性

```js
class Moudle {
    // ...
    // 用于于表示他自己是否写了namespaced
    get namespaced() {
        return !!this._raw.namespaced
    }
}
```

## ModuleCollection处理

ModuleCollection增加配置时的名称获取接口getNamespace，用于创建store时获取对应名称

```js
class ModuleCollection {
    // ...
    getNamespace(path) {
        // 返回一个字符串 a/b/c
        let root = this.root
        // 从根部不断获取子module，通过判断namespaced是否存在组成通过/分割的名称
        let ns = path.reduce((ns, key) => {
            let module = root.getChild(key)
            root = module
            return module.namespaced ? ns + key + '/' : ns
        }, '')
        return ns
    }
    // ...
}
```

## installModule处理

getNamespace获取分割名称ns

installModule在配置wrapperGetter、mutations和actions时， key设置为ns + key

```js
function installModule(store, rootState, path, module) {
    // 获取namespace分割好的名字
    let ns = store._modules.getNamespace(path)
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        Vue.set(parent, path[path.length - 1], module.state)
    }

    // key设置更改为ns + key
    module.forEachGetter((fn, key) => {
        store.wrapperGetter[ns + key] = function() {
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
```
