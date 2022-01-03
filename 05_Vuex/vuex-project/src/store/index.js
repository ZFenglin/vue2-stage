import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../vuex/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // state => data
    name: 'zfl',
    age: 26,
  },
  mutations: { // methods commit 同步状态更改
    changeAge(state, payload) {
      state.age += payload
    }
  },
  actions: { // 异步操作，调用api接口，多次commit mutations
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit('changeAge', payload)
      }, 1000)
    }
  },
  getters: { // 计算属性
    myAge(state) {
      return state.age + 1
    }
  },
  strict: true, // 严格模式，不允许在组件中修改state
  modules: {
  }
})
