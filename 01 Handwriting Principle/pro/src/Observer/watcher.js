import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.user = !!options.user // 是不是用户自定义的watcher
        this.id = id++
        this.lazy = !!options.lazy
        this.dirty = options.lazy // 如果是计算属性，则默认lazy为true，同样dirty为true

        // expOrFn判断是否是函数，决定如何处理
        if (typeof expOrFn === 'string') {
            this.getter = function () {
                // 当数据取值时，进行依赖收集
                // vue中一取值就会触发响应式的getter，所以可以收集依赖

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
        this.depsId = new Set() // 收集id用于去重

        // 第一次渲染的value
        this.value = this.lazy ? undefined : this.get() // 默认初始化取值
    }

    get() { // 稍后用于更新时，可以重新调用getter方法
        // defineProperty.get 触发，每个属性都可以收集自己的watcher
        // 同时希望一个属性可以对应多个watcher,同时一个watcher可以对应多个属性
        pushTarget(this) // Dep.target = this
        // 更新视图 注意函数this
        const value = this.getter.call(this.vm) // 渲染是会触发属性的取值即Object.defineProperty.get触发
        popTarget() // Dep.target = null 如果Dep.target有值，说明变量在模板中使用了
        return value
    }

    /**
     * 渲染更新
     */
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            // 每次更新时 this
            queueWatcher(this) // 多次调用update，将watcher缓存起来，等下一起更新
        }
    }

    /**
     * 页面更新
     */
    run() {
        // 新旧值获取
        let newValue = this.get()
        let oldValue = this.value
        this.value = newValue
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

    /**
     * computed属性的watcher求值
     */
    evaluate() {
        this.dirty = false
        this.value = this.get() // 用户的getter执行
    }

    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend() // lastName和firstName收集渲染watcher
        }
    }
}
// Watcher 和 Dep
// 将更新的功能封装成一个watcher
// 渲染页面前会将当前watcher放到Dep类上
// vue页面中渲染使用的属性， 会进行依赖手机
// 取值是会给每个属性都增加了dep.用于存储这个渲染的wactehr
// 每个属性对应多个视图，一个视图对应多个watcher
// dep.depend() => 通知dep存放watcher => Dep.target.depend() => 通知watcher存放dep
// 双向存储

export default Watcher