# generate转化AST对象

## 抽离parserHTML

将parserHTML抽离为一个单独文件 parser.js
并在parserHTML方法结尾将处理好的root返回

## 增加generate

使用generate方法将AST对象转化为可执行的代码

```JavaScript
export function compileToFunction(template) {
    let root = parserHTML(template)
    // html => ast(语法树，语法不存在的属性无法描述) => render函数 => 虚拟dom（增加额外属性） => 生成真实dom
    // 生成代码 codegen
    let code = generate(root)
    console.log(code)
}
```

单独创建个generate文件夹用于处理代码生成

```JavaScript
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配{{}}

function genProps(attrs) { // 标签属性处理
    // ...
}

function gen(el) {
    // ...
}

function genChildren(el) {
    // ...
}

export function generate(el) {
    // 迭代处理el子节点
    let children = genChildren(el)
    // 将处理的结果拼接为_c()包裹的字符串
    let code = `_c('${el.tag}', ${el.attrs.length ? genProps(el.attrs) : 'undefined'
        },${children ? `,${children}` : ''})`
    return code
}
```

### 标签属性处理

for循环遍历el.attrs，每次处理一个属性
遭遇属性名为style的属性, 利用replace方法将其值替换为一个对象
将属性名称和属性值的字符串进行拼接并删除最后一个逗号返回

```JavaScript
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
            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function() {
                styleObj[arguments[1]] = arguments[2]
            })
            attr.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` // JSON.stringify用于增加双引号
    }
    return `{${str.slice(0, -1)}}` // 删除最后一个逗号
}
```

### children处理

获取元素的children
利用map方法遍历children，每次通过gen处理一个元素
将结果用join(', ')拼接返回

```JavaScript
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
```

### children元素或文本处理

判断是否为元素， 是元素则调用generate处理节点元素

defaultTagRE判断元素是否存在插值表达式 不存在返回 _v(${el.text})

插值处理
tokens 收集插值处理的数据
lastIndex 标记处理结束的位置

while循环遍历插值表达式
先将插值前的字符串添加
再将插值表达式添加到tokens数组
更新lastIndex
再次遍历，直到插值处理完成

最后将插值后的字符串添加

最后拼接成字符串_v(${tokens.join('+')})


```JavaScript
function gen(el) {
    // 判断是否是元素，如果是元素，则处理元素
    if (el.type === 1) {
        return generate(el)
    } else {
        let text = el.text
        if (!defaultTagRE.test(text)) {
            return `_v(${el.text})`
        } else {
            // hello {{name}}
            let tokens = [] // 收集文本字符串和插值表达式处理后的函数
            let match
            let lastIndex = defaultTagRE.lastIndex = 0 // CSS-LOADER 原理一样
            while (match = defaultTagRE.exec(text)) { // 0 {{name}} 1 name
                let index = match.index // 匹配结果在整个字符串的开始索引
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 插值语法前的文本字符串添加
                }
                // 插值语法处理添加
                tokens.push(`_s(${match[1].trim()})`)
                // 更新lastIndex
                lastIndex = index + match[0].length
            }
            // 插值后面的文本字符串添加
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            // 拼接成一个字符串
            return `_v(${tokens.join('+')})`
        }
    }
}
```
