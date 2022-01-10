import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../vue-router/index'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter) // 注册全局

// 核心实现就是根据路径变化，找到对应的组件，显示到router-view中
const routes = [
  // 映射标，用户配置
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a', // 加/a则代表根路径/a
        component: {
          render: (h) => h('div', 'about - a')
        }
      },
      {
        path: 'b',
        component: {
          render: (h) => h('div', 'about - b')
        }
      },
    ],
  }
]
// 最终生成一个vue-router实例
const router = new VueRouter({
  // mode: 'history',
  mode: 'hash', // #丑，但是兼容性好 history好看但是需要服务器支持，在开发环境内部，提供了historyFallback
  routes,
})

router.beforeEach((to, from, next) => {
  // 全局钩子 路由钩子 组件钩子
  console.log(1, to, from)
  next()
})
router.beforeEach((to, from, next) => {
  // 全局钩子 路由钩子 组件钩子
  console.log(2, to, from)
  next()
})

export default router
