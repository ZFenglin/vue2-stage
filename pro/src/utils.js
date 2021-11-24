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