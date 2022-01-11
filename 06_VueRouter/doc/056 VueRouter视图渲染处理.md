# VueRouter视图渲染处理

## install注册_router

install在每个组件的beforeCreate上都会创建_route属性，并将其赋值为当前路径的路由

```js
export default function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                this._router = this.$options.router
                this._routerRoot = this
                this._router.init(this)
                // 注册响应式的_route属性
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else {
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
        }
    })
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router
        }
    })
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route
        }
    })
    Vue.component('router-link', RouterLink)
    Vue.component('router-view', RouterView)
}
```

## VueRouter的init

init上增加对current变动时的回调

```js
init(app) {
    const history = this.history
    const setUpListeners = () => {
        history.setUpListeners()
    }
    history.transitionTo(history.getCurrentLocation(), setUpListeners)
    // history上注册监听器
    history.listen((route) => {
        app._route = route
    })
}
```

history的注册的监听处理

```js
// history注册监听器
listen(cb) {
    this.cb = cb
}

transitionTo(path, cb) {
    let record = this.router.match(path)
    // 获取新路由
    let route = createRoute(record, {
        path
    })
    // 由于之前注册了hash变动监听器，会导致transitionTo两次执行
    // 如果两次路由一致，停止跳转
    // 1. 保证当前路径一致
    // 2. 匹配记录的个数应该一致
    if (path === this.current.path && route.matched.length === this.current.matched.length) return
    // 更新this.current
    this.current = route
    // 调用回调，触发app上的_route属性的更新，从而触发视图更新
    this.cb && this.cb(route)
    // 传入回调执行
    cb && cb()
}
```

## VueRouter增加push

```js
// 负责路由跳转
push(loaction) {
    // 跳转页面
    this.history.transitionTo(loaction, () => {
        window.location.hash = loaction
    })
}
```

## 组件处理

路由组件都是函数式组件，不存在自身的data属性

link组件处理

```jsx
export default {
    functional: true, 
    props: {
        to: {
            type: String,
            required: true
        }
    },
    // render的第二个函数是自己声明的对象
    render(h, { props, slots, parent }) {
        const click = () => {
            parent.$router.push(props.to)
        }
        return <a onClick={click}>{slots().default}</a>
    }
}
```

view组件处理

```jsx
export default {
    functional: true,
    render(h, { parent, data }) {
        // 等价于_route，等价于this._router.history.current
        let route = parent.$route
        // 渲染是从父向子的
        // 从子不断向父级访问，获取当前route-view的组件所处层级
        let depth = 0
        while (parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
        // 通过层级获取record
        let record = route.matched[depth]
        if (!record) {
            return h()
        }
        // 标记为routerView组件，用于下次层级获取
        data.routerView = true
        // 渲染对应组件
        return h(record.component, data)
    }
}
```
