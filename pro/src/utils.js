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

