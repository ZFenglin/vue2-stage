class CollpaseItem extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: "open" })
        const tmpl = document.getElementById("collapse_item_tmp1")
        let cloneTmpl = tmpl.content.cloneNode(true) // true表示所有节点都克隆
        shadow.appendChild(cloneTmpl)

        let style = document.createElement('style')
        style.textContent = `
        :host{
            width: 100%;
        }
            .title{
                height: 35px;
                line-height: 35px;
                background: #f1f1f1;
            }
            .content{
                font-size: 14px;
            }
        `
        shadow.appendChild(style)


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

        this.isShow = true;

    }

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
            this.isShow = this.activeList.includes(this.name)
            this.shadowRoot.querySelector('.content').style.display = this.isShow ? 'block' : 'none'
        }
    }
}

export default CollpaseItem