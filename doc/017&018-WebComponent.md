# WebComponent

优点 : 原生组件，不需要框架，性能好
缺点： 兼容性

组件化好处： 高内聚，可重用，可组合

## 核心三项技术

1. custom elements: 一组javascript的API, 允许定义custom elements及其行为，然后在用户页面中使用他们
2. Shadow DOM： 一组javascript的API, 用于将封装的影子DOM树附加到元素中并控制其关联的功能，保持元素的私有性，这样可以被脚本化和样式化，不用担心冲突
3. HTML template： <template> 和 <slot> 元素，可以编写不再呈现页面中现实的标记模板，可以作为自定义元素结构的基础被多次重用

## web-component组成和简单使用

```HTML
    <!-- 1. 组件使用 -->
    <fl-button type="primary">按钮</fl-button>
    <fl-button type="default">按钮</fl-button>

    <!-- 2. 模板 -->
    <!--内容不会被渲染到视图上，不会影响页面展示，可以使用模板-->
    <template id="btn">
        <button class="fl-button">
            <slot></slot>
        </button>
    </template>
    <script>
        // 3. 定义组件
        // 定义了一个自定义标签组件
        window.customElements.define('fl-button', FlButton);
        class FlButton extends HTMLElement {
            constructor() {
                super()

                // 获取shadow
                let shadow = this.attachShadow({
                    mode: 'open'
                })

                // 元素添加
                let btn = document.getElementById('btn')
                // 复制一份模板
                // true表示所有节点都克隆
                let btnClone = btn.content.cloneNode(true)
                shadow.appendChild(btnClone)

                // 获取组件属性
                let type = this.getAttribute('type') || 'default'
                // 可以设置shadow根元素的class， 利用:host
                const btnStyle = {
                    'primary': {
                        backgroud: "#409eff"
                    },
                    'default': {
                        backgroud: "#909399"
                    }
                }

                // 样式添加
                // 但是用户无法自定义，可以控制属性或使用CSS变量控制
                const style = document.createElement('style')
                style.textContent = `
                .fl-button {
                    outline: none;
                    border: none;
                    border-radius: 5px;
                    padding: 10px 20px;
                    display: inline-flex;
                    color: #FFF;
                    background: ${btnStyle[type].backgroud};
                }
                `
                shadow.appendChild(style)
            }
        }
    </script>
```

## web-component监听注册

生命监控

```JS
// 静态属性获取值，用于监控属性变化
static get observedAttributes() {
    return ['active']
}

connectedCallback() {
    // console.log('插入到dom回调')
}

disconnectedCallback() {
    // console.log('移除出dom回调')
}

adoptedCallback() {
    // console.log('移除到iframe回调')
}

// 生命周期-监听属性变化
attributeChangedCallback(key, oldVal, newVal) {
    if (key == 'active') {
        this.activeList = JSON.stringify(newVal)
        this.render()
    }
}
```

注册监听

```JavaScript
// 插槽监控
let slot = shadow.querySelector('slot')
slot.addEventListener('slotchange', (e) => {
    this.slotList = e.target.assignedElements()
    this.render()
})
```

## 组件间传值

### 变化监听

子组件监听属性变化

```JavaScript
static get observedAttributes() {
    return ['active', 'title', 'name']
}

attributeChangedCallback(key, oldVal, newVal) {
    switch (key) {
        case 'active':
            this.activeList = JSON.stringify(newVal)
            break;
        case 'title':
            this.titeEle.innerHTML = newVal
            break;
        case 'name':
            this.name = newVal
            break;
        default:
            break;
    }

    if (this.activeList && this.name) {
        let isShow = this.activeList.includes(key)
        this.shadowRoot.querySelector('.content').style.display = isShow ? 'block' : 'none'
    }
}
```

父组件监听属性变化（见上面）

### 父元素注册自定义属性

```JavaScript
// 注册自定义事件
document.querySelector('fl-collapse').addEventListener('changeName', (e) => {

    let {
        isShow,
        name
    } = e.detail
    if (isShow) {
        let index = defaultActive.indexOf(name)
        defaultActive.splice(index, 1)
    } else {
        defaultActive.push(name)
    }
    document.querySelector('fl-collapse').setAttribute('active', JSON.stringify(defaultActive))

})
```

将结果传输给父元素

```JavaScript
this.titeEle = shadow.querySelector('.title')
this.titeEle.addEventListener('click', () => {
    // 将结果传输给父元素
    // 自定义事件分发
    document.querySelector('fl-collapse').dispatchEvent(new CustomEvent('changeName', {
        detail: {
            isShow: this.isShow,
            name: this.getAttribute('name')
        }
    }))
})
```

### 父元素处理监听渲染

获取父组件插槽，遍历插槽给每一个插槽添加属性，用于修改子元素属性

```JavaScript
// 页面重新渲染
render() {
    if (this.slotList && this.activeList) {
        // 父组件将值传递给子组件
        [...this.slotList].forEach(child => {
            child.setAttribute('active', JSON.stringify(this.activeList))
        })
    }
}
```
