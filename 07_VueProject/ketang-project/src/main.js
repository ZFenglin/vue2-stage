import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker' // serviceworker的配置文件 pwa离线缓存 manifest
import router from './router'
import store from './store'
import 'lib-flexible' // 设置根字体

Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import directives from '@/utils/directives'
// 自定义指令处理
Object.entries(directives).forEach(([id, define]) => {
  Vue.directive(id, define)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
