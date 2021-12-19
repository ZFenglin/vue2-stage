# watch实现

## watch的使用方式

```JS
watch: {
    // 1. 直接写函数
    message(newValue, oldValue) {
        console.log('Old value: ' + oldValue)
        console.log('New value: ' + newValue)
    },
    'age.n'(newValue, oldValue) {
        console.log('Old value: ' + oldValue)
        console.log('New value: ' + newValue)
    },

    // 2. 直接写数组(多个监听器)
    message: [
        function(newValue, oldValue) {
            console.log('Old value: ' + oldValue)
            console.log('New value: ' + newValue)
        },
        function(newValue, oldValue) {
            console.log('Old2 value: ' + oldValue)
            console.log('New2 value: ' + newValue)
        },
    ],

    //3. 直接写字符串, 调用methods中声明方法
    message: 'messageChange'
}
// 4. 外部注册watcher
app.$watch('message', function(newValue, oldValue) {
    console.log('watch Old value: ' + oldValue)
    console.log('watch New value: ' + newValue)
})
```

## Watcher增加用户自定义watcher处理

```JS
import {
    popTarget,
    pushTarget
} from "./dep"
import {
    queueWatcher
} from "./scheduler"

let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++

        // user属性表示是否是用户自定义watcher
        this.user = !!options.user
        // 针对用户自定义watcher存在非function，需要单独处理
        if (typeof expOrFn === 'string') {
            this.getter = function() {
                // age.n ====> vm['age']['n'] 转化取值
                let path = expOrFn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        } else {
            this.getter = expOrFn
        }

        this.deps = []
        this.depsId = new Set()

        // 缓存首次触发的value
        this.value = this.get()
    }

    get() {
        pushTarget(this)
        // 将渲染触发获取的值赋值到this.value上便于缓存，用于触发回调返回新旧值
        const value = this.getter()
        popTarget()
        return value
    }

    /**
     * 渲染更新
     */
    update() {
        queueWatcher(this)
    }

    /**
     * 页面更新
     */
    run() {
        // 获取新旧值，并缓存新值
        let newValue = this.get()
        let oldValue = this.value
        this.value = newValue
        // 如果是用户自定义watcher,则触发对应回调，并传入新旧值
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }

    /**
     * dep添加
     * @param {*} dep 
     */
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
}

export default Watcher
```

## $watch接口暴露

增加stateMixin混入$watch接口

```JS
export function stateMixin(Vue) {
    Vue.prototype.$watch = function(key, handler, options = {}) {
        // 表示是用户自定义的watcher
        options.user = true
        let watcher = new Watcher(this, key, handler, options) // vm,name,用户回调，用户自定义属性
        // 如果设定为立即触发，则直接调用handle一次
        if (options.immediate) {
            handler(watcher.value)
        }
    }
}
```

声明Vue时混入

```JS
function Vue(options) {
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
// Vue实例上增加$watch
stateMixin(Vue)
```

## watch初始化处理

```JS
/**
 * 状态初始化
 * @param {*} vm 
 */
export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    // 增加watch初始化触发
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

/**
 * watcher初始化
 * @param {*} vm 
 * @param {*} watch 
 */
function initWatch(vm, watch) {
    for (const key in watch) {
        let handler = watch[key]
        if (Array.isArray(handler)) {
            // 处理数组形式使用watch
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

/**
 * vm绑定watcher
 * @param {*} vm 
 * @param {*} key 
 * @param {*} handler 
 * @returns 
 */
function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}
```
