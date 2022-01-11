import * as Types from '@/store/modules/action-types'

const homeMutations = {
    [Types.SET_CATEGORY](state, payload) { // 修改状态分类
        state.category = payload
    },
    [Types.SET_SLIDES](state, payload) { // 修改状态分类
        state.slides = payload
    },
}
export default homeMutations