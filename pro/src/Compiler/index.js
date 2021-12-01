import { generate } from "./generate"
import { parserHTML } from "./parser"

export function compileToFunction(template) {
    let root = parserHTML(template)
    // html => ast(语法树，语法不存在的属性无法描述) => render函数 => 虚拟dom（增加额外属性） => 生成真实dom
    // 生成代码 codegen
    let code = generate(root)
    console.log(code)
}
