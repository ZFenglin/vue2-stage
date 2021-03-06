import { isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";
// 响应式就是给所有属性套层外壳

/**
 * 监测数据
 * 使用class可以添加类型，方便检查
 */
// 给对象新增属性不会触发试图更新，（给对象增加dep，dep存wacther，增加属性后，手动触发watcher更新）
class Observer {
    constructor(data) {
        this.dep = new Dep() // 当前数据可能是数组，也可能是对象

        Object.defineProperty(data, '__ob__', {
            value: this,    // 所有被劫持的属性都具有__ob__属性，这个属性是一个Observer实例
            enumerable: false, // 设置为false，不可枚举，注意循环引用的时候，不能被遍历到
        })
        if (Array.isArray(data)) {
            // 数组劫持处理
            // 对数组方法进行改写 切片编程 高阶函数
            data.__proto__ = arrayMethods
            // 如果数组中数据是对象, 那么也要进行监测
            this.observeArray(data)
        } else {
            // 对象劫持处理
            this.walk(data)
        }
    }
    // 数组中数组和对象劫持
    // 虽然数组没监听索引，但是其中的对象会进行处理，可以使用Object.freeze() 冻结对象
    observeArray(data) {
        // 数组也是对象类型，也做了观测
        data.forEach(item => {
            observe(item)
        })
    }
    // 对象劫持
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i] // 数组内数组
        current.__ob__ && current.__ob__.dep.depend() // 如果是数组，那么也要进行监测
        if (Array.isArray(current)) {
            dependArray(current)
        }
    }
}

// vue2会对对象进行遍历，对每个属性重新定义，性能差
function defineReactive(data, key, value) {
    let childOb = observe(value) // 对象套对象，则需要遍历（性能差）
    // 属性创建自己的dep
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            // 取值时希望将watcher和dep关联起来
            if (Dep.target) {// 说明这个值在模板中被访问了
                dep.depend() // 让dep记住watcher
                if (childOb) { // 可能是数组，也可能是对象， 例如$set
                    childOb.dep.depend() // 让数组和对象也继承watcher

                    if (Array.isArray(value)) { // 取外层数组将数组里面的数据也监测（不建议多层组数处理）
                        // 如果是数组，那么也要进行监测
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newVal) {
            // 相似结果拦截
            if (newVal === value) return
            observe(newVal);// 当用户设置新对象，则对这个对象进劫持
            value = newVal
            dep.notify() // 通知所有的watcher
        }
    })
}

export function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
        return
    }
    // 如果已经被劫持过了，就不再劫持
    if (data.__ob__) {
        return data.__ob__
    }
    // 默认最外层的data必须是个对象
    return new Observer(data)
}