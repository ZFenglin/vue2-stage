const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
/**
 * 标签属性值处理
 * @param {*} attrs 
 * @returns 
 */
function genProps(attrs) { // {{name: 'xxx', value: 'yyy'}}
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]
        // style 样式匹配
        if (attr.name === 'style') {
            let styleObj = {}
            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2]
            })
            attr.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` // JSON.stringify用于增加双引号
    }
    return `{${str.slice(0, -1)}}` // 删除最后一个逗号
}
function gen(el) {
    // 判断是否是元素，如果是元素，则处理元素
    if (el.type === 1) {
        return generate(el)
    } else {
        let text = el.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            // hello {{name}} world
            let tokens = []
            let match
            let lastIndex = defaultTagRE.lastIndex = 0  // CSS-LOADER 原理一样
            while (match = defaultTagRE.exec(text)) {
                let index = match.index // 开始索引
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}

/**
 * children处理
 * @param {*} el 
 * @returns 
 */
function genChildren(el) {
    let children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
    return false
}

export function generate(el) {
    // 遍历树，将树拼接成字符串
    let children = genChildren(el)
    let code = `_c('${el.tag}', ${el.attrs.length ? genProps(el.attrs) : 'undefined'
        }${children ? `,${children}` : ''})`
    return code
}