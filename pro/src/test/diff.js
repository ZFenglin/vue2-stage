import { compileToFunction } from "../Compiler/index"
import { createElm, patch } from "../vdom/patch"


/**
 * 测试diff
 * @param {*} Vue 
 */
export function diffTest(Vue) {
  // diff核心
  let oldTemplate = `<div>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
  </div>` // vue3在最外层加了一层div，内部可以多个元素
  let vm1 = new Vue({ data: { msg: 'hello' } })
  const render1 = compileToFunction(oldTemplate)
  const oldVnode = render1.call(vm1)
  document.body.appendChild(createElm(oldVnode))
  // 根据新的虚拟节点更新老的节点，老的能复用尽量复用

  // // 元素不同直接替换 v-if v-else
  // let newTemplate = `<p>zf</p>`
  // let vm2 = new Vue({ data: { msg: 'zf' } })
  // const render2 = compileToFunction(newTemplate)
  // const newVnode = render2.call(vm2)

  // 标签一样，属性不同
  let newTemplate = `<div>
  <li key="D">D</li>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
  </div>`
  let vm2 = new Vue({ data: { msg: 'zfl' } })
  const render2 = compileToFunction(newTemplate)
  const newVnode = render2.call(vm2)

  setTimeout(() => {
    patch(oldVnode, newVnode)
  }, 1000)
}