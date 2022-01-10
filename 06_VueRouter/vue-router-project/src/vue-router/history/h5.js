import History from "./base";

export default class HTML5History extends History {
    constructor(router) {
        super(router);
    }
    getCurrentLocation() {
        return window.location.pathname
    }

    setUpListeners() {
        window.addEventListener('popstate', () => {
            // hash值变化后，再去切换组件并渲染
            this.transitionTo(window.location.pathname)
        })
    }
    pushState(location) {
        history.pushState({}, null, location)
    }
}