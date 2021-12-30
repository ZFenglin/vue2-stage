import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 服务端中使用Vuex，保存数据到全局变量window中，浏览器用渲染好的数据进行替换

export default () => {
    let store = new Vuex.Store({
        state: {
            name: 'zfl'
        },
        mutations: {
            changeName(state, payload) {
                state.name = payload
            }
        },
        actions: {
            changeName({ commit }) { // store.dispatch('changeName')
                return new Promise((resolve) => {
                    setTimeout(() => {
                        commit('changeName', 'zhufenglin')
                        resolve()
                    }, 1000)
                 })
            }
        }
    })

    if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        // 浏览器开始渲染了，将服务端的数据替换成浏览器的数据
        // replaceState vuex的核心方法，替换根状态
        store.replaceState(window.__INITIAL_STATE__)
    }

    return store
}