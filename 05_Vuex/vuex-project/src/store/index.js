import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../vuex/index'
Vue.use(Vuex)

// logger插件
function logger() {
  return function (store) {
    let prevState = JSON.stringify(store.state)
    store.subscribe((mutation, state) => {
      // 所有更新操作都基于mutation,状态变化通过mutation
      // 如果直接受到的更改状态，此subscribe是不会执行的(只有mutation的会触发通知)
      console.log('prevState', prevState)
      console.log('mutation', mutation)
      console.log('currentState', JSON.stringify(state))
      prevState = JSON.stringify(state)
    })
  }
}

// 持久化插件
function persists() {
  // 每次状态变化存至localstorge
  return function (store) {
    let localState = JSON.parse(localStorage.getItem('VUEX:STATE'))
    if (localState) {
      store.replaceState(localState)
    }
    store.subscribe((mutations, rooState) => {
      localStorage.setItem('VUEX:STATE', JSON.stringify(rooState))
    })
  }
}


const store = new Vuex.Store({
  // vuex持久化插件
  plugins: [
    persists(),
    // logger(),
  ],
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
  strict: true, // 严格模式，不允许在组件中修改state // 不是再mutation中更改则会报错
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
  }
})

export default store