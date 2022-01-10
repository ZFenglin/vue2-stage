import History from "./base";

function ensurehash() {
    // hash路由初始化需要增加默认的hash值 /#/
    if (!window.location.hash) {
        window.location.hash = '/'
    }
}

function getHash() {
    return window.location.hash.slice(1)
}

export default class Hash extends History {
    constructor(router) {
        super(router);
        ensurehash();
    }

    getCurrentLocation() {
        return getHash()
    }

    setUpListeners() {
        window.addEventListener('hashchange', () => {
            // hash值变化后，再去切换组件并渲染
            this.transitionTo(getHash())
        })
    }
    pushState(location) {
        window.location.hash = location // 更改hash值
    }
}  