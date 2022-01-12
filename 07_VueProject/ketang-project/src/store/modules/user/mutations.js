import * as Types from '@/store/modules/action-types'
const userMutations = {
    [Types.SET_USER](state, payload) {
        state.username = payload.username
        state.token = payload.token
        state.authList = payload.authList
        state.btnPermission = payload.btnPermission
        // 存储token，cookies或者loaclStorage
        if (payload.token) {
            localStorage.setItem('token', payload.token)
        }
    },
    [Types.SET_PERMISSION](state, payload) {
        state.hasPermission = payload
    },
    [Types.SET_MENU_PERMISSION](state, payload) {
        state.menuPermission = payload
    },
}

export default userMutations