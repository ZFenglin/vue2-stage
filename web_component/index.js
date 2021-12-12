import Collapse from "./collapse.js";
import CollpaseItem from "./collapse-item.js";

window.customElements.define('fl-collapse', Collapse)
window.customElements.define('fl-collapse-item', CollpaseItem)

let defaultActive = ['1', '2'] // name 是 1或2默认展开， 3不展开

// 每个item需要获取到defaultActive和自己的name属性比较,如果在里面就现实
document.querySelector('fl-collapse').setAttribute('active', JSON.stringify(defaultActive))
// 注册自定义事件
document.querySelector('fl-collapse').addEventListener('changeName', (e) => {
    let { isShow, name } = e.detail
    if (isShow) {
        let index = defaultActive.indexOf(name)
        defaultActive.splice(index, 1)
    } else {
        defaultActive.push(name)
    }
    document.querySelector('fl-collapse').setAttribute('active', JSON.stringify(defaultActive))
})
