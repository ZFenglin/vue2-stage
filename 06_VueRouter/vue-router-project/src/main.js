import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// vuex store $store
// vue-router _router $router $route (原型扩展的) 
// 两个现成的组件 router-link router-view

new Vue({
  router, // 注入了router
  render: h => h(App)
}).$mount('#app')
