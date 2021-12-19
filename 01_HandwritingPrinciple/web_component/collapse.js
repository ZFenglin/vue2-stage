class Collapse extends HTMLElement {
    constructor() {
        super()
        // 添加标签
        const shadow = this.attachShadow({ mode: "open" })
        const tmpl = document.getElementById("collapse_tmp1")
        let cloneTmpl = tmpl.content.cloneNode(true) // true表示所有节点都克隆
        shadow.appendChild(cloneTmpl)

        // 设置元素
        let style = document.createElement('style')
        // :host影子的根元素
        style.textContent = `
        :host{
            display:flex;
            border: 3px solid #ebebeb;
            border-radius:5px;
            width:100%;
        }
        .fl-collapse{
            width:100%;
        }
        `
        shadow.appendChild(style)


        // 插槽监控
        let slot = shadow.querySelector('slot')
        slot.addEventListener('slotchange', (e) => {
            this.slotList = e.target.assignedElements()
            this.render()
        })

    }

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

    // 页面重新渲染
    render() {
        if (this.slotList && this.activeList) {
            // 父组件将值传递给子组件
            [...this.slotList].forEach(child => {
                child.setAttribute('active', JSON.stringify(this.activeList))
            })
        }
    }
}

export default Collapse