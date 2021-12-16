let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype) // arrayMethods.__proto__ = Array.prototype 继承获取属性方法

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    // 用户调用时，如果用以上的方法，则用重写的，否则用原生的
    arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].apply(this, args) // 执行原生的方法
        // arr.push({a: 1},{a: 2},{a: 3}) push对象也需要处理，则方法中需要对新增对象进行劫持
        let inserted // 新增的对象
        let ob = this.__ob__ // 获取当前数组的Observer实例，为了后面使用observeArray方法
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2) // 只取splice中的新增对象
                break
        }
        // TODO 更新视图
        // 如果有新增对象，则需要对新增的对象进行劫持，需要观测数组每一项，而不是数组本身
        if (inserted) ob.observeArray(inserted)

        // 数组的observe.dep 属性
        ob.dep.notify()
    }
})

