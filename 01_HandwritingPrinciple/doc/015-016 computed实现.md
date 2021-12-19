# computed实现

computed和watch一样，是个新的自定义watcher
但是存在lazy和dirty用于处理值的懒加载和缓存更新

## watcher的懒加载处理

```JS
let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++

        this.user = !!options.user
        // 获取设置是否为懒加载
        this.lazy = !!options.lazy

        if (typeof expOrFn === 'string') {
            this.getter = function() {
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

        // 第一次渲染的value，根据this.lazy决定是否进行首次get
        this.value = this.lazy ? undefined : this.get()
    }
    // ...
}

export default Watcher
```

## computer初始化

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
    // 状态初始化增加computed初始化触发
    if (opts.computed) {
        initComputed(vm, opts.computed)
    }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

// ...

/**
 * computed初始化
 * @param {*} vm 
 * @param {*} computed 
 */
function initComputed(vm, computed) {
    for (const key in computed) {
        // 获取对应处理函数或对象（对象中定义get）
        const userDef = computed[key]
        // 判断获取getter
        let getter = typeof userDef === 'function' ? userDef : userDef.get
        // 创建懒加载形式的Watcher
        new Watcher(vm, getter, () => {}, {
            lazy: true
        })
        // 将key定义在vm上
        defineComputed(vm, key, userDef)
    }
}

/**
 * computed挂载到vm上
 * @param {*} vm 
 * @param {*} key 
 * @param {*} userDef 
 */
function defineComputed(vm, key, userDef) {
    let shareProperty = {}
    if (typeof userDef === 'function') {
        shareProperty.get = userDef
    } else {
        shareProperty.get = userDef.get
    }
    Object.defineProperty(vm, key, shareProperty)
}
```

## computed缓存处理

利用dirty决定是否触发get

### wathcer缓存处理

```JS
let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++

        this.user = !!options.user
        this.lazy = !!options.lazy
        // 如果是计算属性，则默认lazy为true，同样dirty为true
        this.dirty = options.lazy

        if (typeof expOrFn === 'string') {
            this.getter = function() {
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

        this.value = this.lazy ? undefined : this.get()
    }

    get() {
        pushTarget(this)
        // 更新视图 注意函数this
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }

    update() {
        // 更新时将computed的watcher的this.dirty = true
        // 同时也表示computed的watcher并不参与页面渲染处理
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
    }

    // ...

    /**
     * computed属性的watcher求值
     */
    evaluate() {
        this.dirty = false
        this.value = this.get()
    }

}

export default Watcher
```

### 初始化缓存处理

```JS
// ...

/**
 * computed初始化
 * @param {*} vm 
 * @param {*} computed 
 */
function initComputed(vm, computed) {
    // 增加watchers，用于收集所有的computed的watcher
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
        const userDef = computed[key]
        let getter = typeof userDef === 'function' ? userDef : userDef.get
        // 将watcher存至watchers中，进行映射
        watchers[key] = new Watcher(vm, getter, () => {}, {
            lazy: true
        })
        defineComputed(vm, key, userDef)
    }
}

/**
 * 获取计算属性getter的方法
 * @param {*} key 
 * @returns 
 */
function createComputedGetter(key) {
    return function computedGetter() {
        // 取出对应属性的计算属性watcher, 根据dirty属性，来判断是否需要重新计算
        let watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
        }
        return watcher.value
    }
}

/**
 * computed挂载到vm上
 * @param {*} vm 
 * @param {*} key 
 * @param {*} userDef 
 */
function defineComputed(vm, key, userDef) {
    let shareProperty = {}
    if (typeof userDef === 'function') {
        shareProperty.get = userDef
    } else {
        // 修改getter处理，并增加set
        shareProperty.get = createComputedGetter(key)
        shareProperty.set = userDef.set || (() => {})
    }
    Object.defineProperty(vm, key, shareProperty)
}
```

## computed渲染触发

computed的属性不会触发页面更改，我们希望的是修改子属性，会触发页面的渲染watcher

应此需要在Dep上维护一个栈，用作触发子属性渲染watcher收集

```JS
// ...

let stack = []

export function pushTarget(wathcer) {
    stack.push(wathcer)
    Dep.target = wathcer
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}
```

wathcer增加将触发所有dep收集watcher方法

```JS
depend() {
    let i = this.deps.length
    while (i--) {
        // 此处会对子属性的watcher收集
        this.deps[i].depend()
    }
}
```

computed的getter中

```JS
function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
        }
        // 如果取完值后，Dep.target还有值，则继续收集
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}
```
