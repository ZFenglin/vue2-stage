import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../vuex/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { // state => data
    name: 'zfl',
    age: 26,
    a: { // 会被moudles所覆盖
      state: {
        name: 't3',
        age: 30
      }
    },
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
    a: {
      namespaced: true, // 命名空间, 解决名称冲突问题
      // 没有namespaced，则gtters都会被定义到夫模块上
      // mutations会被合并在一起
      state: {
        name: 't1',
        age: 10
      },
      getters: {
        myAge(state) { // 重名会重叠
          return state.age + 20
        }
      },
      mutations: { // 同名内外同步更改
        changeAge(state, payload) {
          state.age += payload
        }
      },
      modules: {
        c: {
          namespaced: true,
          state: {
            age: 100
          },
          mutations: {
            changeAge(state, payload) {
              state.age += payload
            }
          },
          modules: {
            d: {
              namespaced: true,
            }
          }
        },
      },
    },
    b: {
      namespaced: true,
      state: {
        name: 't2',
        age: 20
      }
    }
  }
})

export default store