# SSR Router实现

Vue为了性能考虑，只会对首屏进入进行服务端渲染，后续页面跳转交互都交给客户端代码控制

## router配置

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由是根据路径的不同渲染不同的组件
// 前端路由两种方式hash和history
// 1.hash路由 hash值变化但是页面并不会重新渲染，具有历史记录（一般不用于正式环境，不好看）
// 2.history 好看，但是刷新时会404，具有历史记录

// 每个人访问服务器都需要有一个路由对象，所有直接用方法产生路由对象
export default () => {
    let router = new VueRouter({
        mode: 'history',
        routes: [{
                path: '/',
                component: () => import('../components/Foo.vue')
            },
            {
                path: '/bar',
                component: () => import('../components/Bar.vue')
            },
            // 设置404拦截页面
            {
                path: '*',
                component: {
                    render: (h) => h('div', '404')
                }
            }
        ]
    })
    return router
}
```

## 接入router

app入口增加创建router的代码，并返回router对象

```js
import Vue from 'vue'
import App from './App.vue'
import createRouter from './router/index.js'

// 入口改装成了函数，目的是服务端渲染时，每次访问合适的都可以通过工厂函数返回一个新实例，保证每个人都可以拿到自己的一个实例
export default () => {
    const router = createRouter()
    const app = new Vue({
        router,
        render: h => h(App)
    })
    return {
        app,
        router
    }
}
```

服务端入口增加对router处理

```js
// 服务端入口
import createApp from './app.js'

export default ({
    url // 服务端调用方法时传入url属性
}) => {
    return new Promise((resolve, reject) => {
        let {
            app,
            router
        } = createApp()
        // 表示路由跳转至传入值
        router.push(url)
        router.onReady(() => {
            // 等待路由跳转完毕，组件已经准备好触发
            const matchComponents = router.getMatchedComponents()
            // 获取匹配到的组件，不存在则触发404报错
            if (matchComponents.length == 0) {
                return reject({
                    code: 404
                })
            } else {
                resolve(app)
            }
        })
    })
}
```

## 服务端处理

```js
const Koa = require('koa');
const Router = require('koa-router');
const VueServerRender = require('vue-server-renderer')
const fs = require('fs');
const path = require('path')
const static = require('koa-static')

const app = new Koa();
const router = new Router();

const serverBuild = fs.readFileSync(path.resolve(__dirname, '../dist/server.bundle.js'), 'utf-8');
const template = fs.readFileSync(path.resolve(__dirname, '../dist/server.html'), 'utf-8');
const render = VueServerRender.createBundleRenderer(serverBuild, {
    template
})

router.get('/', async (ctx) => {
    ctx.body = await new Promise((resolve, reject) => {
        render.renderToString({
            url: ctx.url // 传入路径参数
        }, (err, html) => {
            if (err) {
                reject(err)
            } else {
                resolve(html)
            }
        })
    })
})

//  当用户访问不存在服务端路径，就返回给你首页，通过前端的客户端js渲染的时候重新根据路径渲染组件
// 只要用户刷新，就会访问服务器
router.get('/(.*)', async (ctx) => {
    ctx.body = await new Promise((resolve, reject) => {
        render.renderToString({
            url: ctx.url // 传入路径参数
        }, (err, html) => {
            // 处理服务端渲染不存在路径的情况
            if (err && err.code === 404) {
                resolve('404 not found')
            } else {
                resolve(html)
            }
        })
    })
})

// 当客户端发送请求时，会先去dist目录下查找
app.use(static(path.resolve(__dirname, '../dist')))
// 然后按照路径寻找
app.use(router.routes());

app.listen(3000);
```
