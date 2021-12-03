import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++
        // 默认让expOrFn执行 expOrFn() 方法作用？render（去vm上取值）
        this.getter = expOrFn
        this.deps = []
        this.depsId = new Set() // 收集id用于去重

        this.get() // 默认初始化取值
    }

    get() { // 稍后用于更新时，可以重新调用getter方法
        // defineProperty.get 触发，每个属性都可以收集自己的watcher
        // 同时希望一个属性可以对应多个watcher,同时一个watcher可以对应多个属性
        pushTarget(this) // Dep.target = this
        // 更新视图
        this.getter() // 渲染是会触发属性的取值即Object.defineProperty.get触发
        popTarget() // Dep.target = null 如果Dep.target有值，说明变量在模板中使用了
    }

    /**
     * 渲染更新
     */
    update() {
        // 每次更新时 this
        queueWatcher(this) // 多次调用update，将watcher缓存起来，等下一起更新
    }

    /**
     * 页面更新
     */
    run() {
        console.log('run')
        this.get() // 为了后续有其他功能处理
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
// Watcher 和 Dep
// 将更新的功能封装成一个watcher
// 渲染页面前会将当前watcher放到Dep类上
// vue页面中渲染使用的属性， 会进行依赖手机
// 取值是会给每个属性都增加了dep.用于存储这个渲染的wactehr
// 每个属性对应多个视图，一个视图对应多个watcher
// dep.depend() => 通知dep存放watcher => Dep.target.depend() => 通知watcher存放dep
// 双向存储

export default Watcher