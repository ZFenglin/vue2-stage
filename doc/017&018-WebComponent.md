# WebComponent

优点 : 原生组件，不需要框架，性能好
缺点： 兼容性

组件化好处： 高内聚，可重用，可组合

## 核心三项技术

1. custom elements: 一组javascript的API, 允许定义custom elements及其行为，然后在用户页面中使用他们
2. Shadow DOM： 一组javascript的API, 用于将封装的影子DOM树附加到元素中并控制其关联的功能，保持元素的私有性，这样可以被脚本化和样式化，不用担心冲突
3. HTML template： <template> 和 <slot> 元素，可以编写不再呈现页面中现实的标记模板，可以作为自定义元素结构的基础被多次重用
