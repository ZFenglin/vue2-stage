import { nextTick } from "../utils"

let queue = []
let has = {} // 做列表，列表维护存放那些watcher
let pending = false

/**
 * 渲染回调事件队列触发
 */
function flushSchedulerQueue() {
    for (let index = 0; index < queue.length; index++) {
        queue[index].run()
    }
    queue = []
    has = {}
    pending = false
}

/**
 * 处理多次更新队列添加处理
 * @param {*} watcher 
 */
export function queueWatcher(watcher) { // 当前执行栈中代码执行完成，会清空微任务，在处理宏任务
    const id = watcher.id
    if (has[id] == null) {
        queue.push(watcher)
        has[id] = true
        // 开启一次更新操作， 批处理（防抖）
        if (!pending) {
            // 
            nextTick(flushSchedulerQueue);
            pending = true
        }
    }


}


