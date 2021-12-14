import { generate } from "./generate"
import { parserHTML } from "./parser"

export function compileToFunction(template) {
    let root = parserHTML(template)
    // html => ast(语法树，语法不存在的属性无法描述) => render函数 =>（with + new Function) =>  虚拟dom（增加额外属性） => 生成真实dom
    // 生成代码 codegen
    let code = generate(root)
    // new Function(code) 会创建一个沙箱模式的函数
    let render = new Function(`with(this){return ${code}}`) // code 中会用到数据， 数据在vm上, 利用with(this) 将数据从vm上拿出来在code中使用
    return render
}

// 1. 给组件创建一个构造函数，基于Vue
// 2. 开始生成虚拟节点，对组件进行特殊处理 data.hook = {init(){}}
// 3. 生成DOM元素，如果当前虚拟节点上有hook.init属性，说明时组件
// 4. 对组件进行 new组件().$mount() => vm.$el
// 5. 将组件的$el插入到父容器中（父组件）