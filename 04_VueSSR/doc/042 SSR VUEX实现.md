# SSR VUEX实现

## store配置

针对服务端渲染，则每次的请求都会创建一个新的store实例

同时检查当前的环境是否为浏览器，决定是否进行vuex替换

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 服务端中使用Vuex，保存数据到全局变量window中，浏览器用渲染好的数据进行替换

export default () => {
    let store = new Vuex.Store({
        state: {
            name: 'zfl'
        },
        mutations: {
            changeName(state, payload) {
                state.name = payload
            }
        },
        actions: {
            changeName({
                commit
            }) { // store.dispatch('changeName')
                return new Promise((resolve) => {
                    setTimeout(() => {
                        commit('changeName', 'zhufenglin')
                        resolve()
                    }, 1000)
                })
            }
        }
    })

    // 浏览器开始渲染了，将服务端的数据替换成浏览器的数据
    if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        // replaceState vuex的核心方法，替换根状态
        store.replaceState(window.__INITIAL_STATE__)
    }

    return store
}
```

## 页面处理

在实例中增加asyncData，在服务端执行代码是会主动触发方法内部获取数据

```Vue
<template>
  <div>
    {{ $store.state.name }}
  </div>
</template>

<script>
export default {
  // 在服务端执行的方法
  asyncData(store) {
    console.log("asyncData");
    return store.dispatch("changeName");
  },
};
</script>
```

## 服务端入口处理

```js
// 服务端入口
import createApp from './app.js'

export default (context) => {
    const {
        url
    } = context
    return new Promise((resolve, reject) => {
        let {
            app,
            router,
            store // 获取创建的store实例
        } = createApp()
        router.push(url)
        router.onReady(() => {
            const matchComponents = router.getMatchedComponents()
            if (matchComponents.length == 0) {
                return reject({
                    code: 404
                })
            } else {
                Promise.all(
                    matchComponents.map(component => {
                        // 触发每个符合路径的组件的asyncData方法
                        // 服务端也会创建一个store实例，并且把store实例传入asyncData方法中
                        if (component.asyncData) {
                            return component.asyncData(store)
                        }
                    })
                ).then(() => {
                    // 会默认在window下生成一个变量，用于客户端替换
                    // 服务器执行完毕后，最新的状态保存在store上
                    context.state = store.state
                    resolve(app)
                })
            }
        })
    })
}
```
