let id = 0
class Dep { // 每个属性都有个dep，用来管理自己的依赖，存放watcher， 同时watcher也要存放自己的dep
    constructor() {
        this.id = id++
        this.subs = [] // 存放watcher
    }
    depend() {
        // Dep需要存在Watcher,同时Watcher也需要存在Dep
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null; // 当前订阅者

export function pushTarget(target) {
    Dep.target = target
}

export function popTarget() {
    Dep.target = null
}

export default Dep

// 响应式创建时创建Dep
// 页面渲染时创建Watcher， 渲染方法会将将自身赋值到Dep中
// 同时获取属性时，会触发Dep收集Watcher