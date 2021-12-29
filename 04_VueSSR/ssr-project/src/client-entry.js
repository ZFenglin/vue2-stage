// 客户端入口
// 每个客户访问实例都要产生新实例，不能所有用户使用同一实例

import createApp from './app.js'
let { app } = createApp()
app.$mount('#app') // 客户端渲染可以直接使用