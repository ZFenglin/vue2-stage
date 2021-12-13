/**
 * 工具
 */

/**
 * 是否是函数判断
 * @param {*} val 
 */
export function isFunction(val) {
    return typeof val === 'function'
}

/**
 * 是否是对象判断
 * @param {*} val 
 */
export function isObject(val) {
    return typeof val === 'object' && val !== null
}


/**
 *  处理异步更新
 */
const callbacks = []
let waiting = false

/**
 * 回调方法触发
 */
function flushCallbacks() {
    callbacks.forEach(cb => cb())
    waiting = false
}


/**
 * 回调方法触发时机处理
 * @param {*} flushCallbacks 
 */
function timer(flushCallbacks) {
    let timerFn = () => { }
    if (Promise) {
        timerFn = () => {
            Promise.resolve().then(flushCallbacks)
        }
    } else if (MutationObserver) {
        let textNode = document.createTextNode(1)
        let observer = new MutationObserver(flushCallbacks)
        observer.observe(textNode, { characterData: true })
        timerFn = () => {
            textNode.textContent = 3
        }
    } else if (setImmediate) {
        timerFn = () => {
            setImmediate(flushCallbacks)
        }
    } else {
        timerFn = () => {
            setTimeout(flushCallbacks);
        }
    }
    timerFn()
}

// 微任务是页面渲染前执行， 但是取的内存中的dom，即使页面未更新但是值真确
export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        // vue2中考虑兼容性问题 vue3中不考虑兼容
        timer(flushCallbacks)
        waiting = true
    }
}



let strats = {} // 存放策略

// 钩子函数策略添加
let lifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
]

lifecycleHooks.forEach(hook => {
    strats[hook] = mergeHook
})
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal] //  第一次执行
        }
    } else {
        return parentVal
    }
}

/**
 * 合并属性
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
    const options = {} // 结果
    // 父亲有的
    for (const key in parent) {
        mergeField(key)
    }
    // 孩子有的
    for (const key in child) {
        // 过滤已经处理过的属性
        if (parent.hasOwnProperty(key)) {
            continue
        }
        mergeField(key)
    }

    function mergeField(key) {
        let parentVal = parent[key]
        let childVal = child[key]
        // 策略模式, 减少if else嵌套
        if (strats[key]) {
            // 存在对应策略则执行策略
            options[key] = strats[key](parentVal, childVal)
        } else {
            // 否则执行默认
            if (isObject(parentVal) && isObject(childVal)) {
                options[key] = { ...parentVal, ...childVal }
            } else {
                options[key] = childVal
            }
        }
    }
    return options
}