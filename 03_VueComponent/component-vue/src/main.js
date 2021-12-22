import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 生成项目的是runtime-only，没有withComilper


// console.log(App) // vue 文件会被vue-loader处理，生成一个对象，中间存在构建好的render函数

Vue.prototype.$dipatch = function (componentName, eventName) {
  let parent = this.$parent // 父组件不能为原生DOM
  while (parent) {
    if (parent.$options.name === componentName) {
      break
    } else {
      parent = parent.$parent
    }
  }
  if (parent && eventName) {
    parent.$emit(eventName)
  }
  return parent
}

Vue.prototype.$broadcast = function (componentName, eventName) {
  let children = this.$children
  let arr = []
  function find(children) {
    children.forEach(child => {
      if (child.$options.name == componentName) {
        arr.push(child)
        if (eventName) {
          child.$emit(eventName)
        }
      }
      if (child.$children) {
        find(child.$children)
      }
    })
  }
  find(children)
  return arr
}

new Vue({
  // render: h => h(App), // _c createElement 
  template: `<App></App>`,
  components: { App }
}).$mount('#app')