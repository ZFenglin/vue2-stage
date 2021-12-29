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
    return { app, router }
}
