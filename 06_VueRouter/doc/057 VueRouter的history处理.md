# VueRouter的history处理

## HTML5History和HashHistory处理

H5补充对应的getCurrentLocation和setUpListeners方法

HTML5History和HashHistory都增加pushState方法用于处理跳转

```js
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
```

## VueRouter的跳转处理

```js
push(location) {
    this.history.transitionTo(location, () => {
        this.history.pushState(location)
    })
}
```
