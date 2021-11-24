import { isObject } from "../utils";
// 响应式就是给所有属性套层外壳

/**
 * 监测数据
 * 使用class可以添加类型，方便检查
 */
class Observer {
    constructor(data) { // 对对象中的所有属性进行劫持
        this.walk(data)
    }
    walk(data) { // 对象
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

// vue2会对对象进行遍历，对每个属性重新定义，性能差
function defineReactive(data, key, value) {
    observe(value) // 对象套对象，则需要遍历（性能差）
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newVal) {
            observe(newVal);// 当用户设置新对象，则对这个对象进劫持
            value = newVal
        }
    })
}

export function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
        return
    }
    // 默认最外层的data必须是个对象
    return new Observer(data)
}