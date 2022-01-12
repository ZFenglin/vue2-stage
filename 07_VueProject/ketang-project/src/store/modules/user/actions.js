import * as Types from '@/store/modules/action-types'
import { toLogin, validate } from '@/api/user'

const userActions = {
    async[Types.SET_USER]({ commit }, { userInfo, has }) {
        commit(Types.SET_USER, userInfo)
        commit(Types.SET_PERMISSION, true)
    },

    async [Types.SET_LOGIN]({ dispatch }, payload) {
        let userInfo = await toLogin(payload)
        dispatch(Types.SET_USER, { userInfo, has: true })
    },
    async [Types.VALIDATE]({ dispatch }, payload) {
        // 此时需要看一下用户是否登录
        if (!localStorage.getItem('token')) return false
        // axios 里面请求增加token
        try {
            let userInfo = await validate()
            dispatch(Types.SET_USER, { userInfo, has: true })
            return true
        } catch (error) {
            dispatch(Types.SET_USER, { userInfo: {}, has: false })
            return false
        }
    }
}

export default userActions