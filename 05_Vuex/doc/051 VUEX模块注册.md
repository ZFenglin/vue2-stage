# VUEX模块注册

## ModuleCollection处理

```js
class ModuleCollection {
    // ...
    register(path, rawModule) {
        let newModule = new Moudle(rawModule)
        // 将创建的newModule放至rawModule上，供模块注册时使用
        rawModule.newModule = newModule
        if (path.length == 0) {
            this.root = newModule
        } else {
            let parent = path.slice(0, -1).reduce((memo, current) => {
                return memo.getChild(current)
            }, this.root)
            parent.addChild(path[path.length - 1], newModule)
        }

        if (rawModule.modules) {
            forEach(rawModule.modules, (module, key) => {
                this.register(path.concat(key), module)
            })
        }
    }
}
```

## 抽离store的vm实例创建

restoreVM用于处理store属性放至vm中

```js
function restoreVM(store, state) {
    let oldVm = store._vm

    // getters处理
    store.getters = {}
    const computed = {}
    forEach(store.wrapperGetter, (getter, key) => {
        computed[key] = getter
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        })
    })
    // 创建vm，并将属性赋值
    store._vm = new Vue({
        data: {
            $$data: state
        },
        computed
    })

    // 重新创建实例后，需要将老的实例卸载掉
    if (oldVm) {
        Vue.nextTick(() => oldVm.$destroy())
    }
}
```

```js
class Store {
    constructor(options) {
        // ...
        installModule(this, state, [], this._modules.root)
        restoreVM(this, state);
        if (options.plugins) {
            // 使用插件默认执行
            options.plugins.forEach(plugin => plugin(this))
        }
    }
    // ...
    // 创建新store接口
    registerModule(path, module) {
        if (typeof path === 'string') path = [path];
        // 向已有的module-collection中注册
        this._modules.register(path, module);
        // 注册完毕后进行安装
        installModule(this, this.state, path, module.newModule)
        // vuex内部重新注册会重新创建实例，虽然重新安装了，只解决的状态的问题，但是computed就丢失了
        restoreVM(this, this.state);
    }
}
```
