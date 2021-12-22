import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 生成项目的是runtime-only，没有withComilper


// console.log(App) // vue 文件会被vue-loader处理，生成一个对象，中间存在构建好的render函数

new Vue({
  // render: h => h(App), // _c createElement 
  template: `<App></App>`,
  components: { App }
}).$mount('#app')
