import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由是根据路径的不同渲染不同的组件
// 前端路由两种方式hash和history
// 1.hash路由 hash值变化但是页面并不会重新渲染，具有历史记录（一般不用于正式环境，不好看）
// 2.history 好看，但是刷新时会404，具有历史记录

// 每个人访问服务器都需要有一个路由对象
export default () => {
    let router = new VueRouter({
        mode: 'history',
        routes: [
            { path: '/', component: () => import('../components/Foo.vue') },
            { path: '/bar', component: () => import('../components/Bar.vue') },
            {
                path: '*', component: {
                    render: (h) => h('div', '404')
                }
            }
        ]
    })
    return router
}