// vue 使用正则来匹配标签
// 标签名称
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 字母开头，后有0到多个字母、数字、下划线、点
// 用于获取标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 可以有命名空间，可以没有 <aa:xxx></aa:xxx>
// 匹配标签开始
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配标签结束
const startTagClose = /^\s*(\/?)>/
// 匹配闭合标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配标签属性
//            a =  ”xxx“ | ’xxx‘ | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配 a="b" a='b' a=b
// 匹配模板语法
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}
// 特殊标签 <!doctype html> <!---->

// html字符串解析成对应的ast，对应脚本来来触发
// 利用htmlparser2来解析模板
/**
 * 创建Ast元素
 * @param {*} tagName 
 * @param {*} attrs 
 * @returns 
 */
function creatAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs: attrs
    }

}

// 将解析后的结果组成一个树结构
// 利用栈进行决定父子关系，栈顶为当前节点父节点，遇见结束标签则出栈
let root = null
let stack = []
function start(tagName, attributes) {
    // 创建元素
    let element = creatAstElement(tagName, attributes)
    // 根元素判断
    if (!root) {
        root = element
    }
    // 当前元素父元素设置和父元素的children设置
    let parent = stack[stack.length - 1]
    if (parent) {
        element.parent = parent
        parent.children.push(element)
    }
    // 栈中添加当前元素
    stack.push(element)
}
function end(tagName) {
    let last = stack.pop()
    if (last.tag !== tagName) {
        throw new Error(`invalid end tag </${tagName}>`) // 标签闭合不匹配
    }
    last
}
function chars(text) {
    text = text.replace(/\s/g, '') // 去除空格
    let parent = stack[stack.length - 1]
    if (text) {
        // 创建文本节点
        parent.children.push({
            type: 3,
            text: text
        })
    }
}

/**
 * 解析html字符串
 * @param {*} html 
 */
function parserHTML(html) { // <div id='app'>123</div>
    /**
     * html字符串前进
     * @param {*} len 
     */
    function advance(len) {
        html = html.substring(len)
    }

    /**
     * 解析开始标签
     * @returns {string}
     */
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length)
            let end, attr
            // 如果没有到结束标签，则一直解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || ''
                })
                advance(attr[0].length)
            }
            // 删除结束标签>
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false // 不是开始标签
    }

    // 看解析内容是否为空，如果存在，则不停解析
    while (html) {
        let textEnd = html.indexOf('<')
        // 解析开始或结束标签
        if (textEnd === 0) {
            // 如果是开始标签，则解析开始标签  <div id='app'>123</div>
            const startTagMatch = parseStartTag(html)
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            // 如果是结束标签，则解析结束标签 </div>
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
            }
        }

        // 如果开头不是<，则解析文本  123</div>
        let text
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }
    }
}

export function compileToFunction(template) {

    parserHTML(template)
    console.log(root)
}