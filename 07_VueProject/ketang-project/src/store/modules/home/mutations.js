import * as Types from '@/store/modules/action-types'

const homeMutations = {
    [Types.SET_CATEGORY](state, payload) { // 修改状态分类
        state.category = payload
    }
}
export default homeMutations