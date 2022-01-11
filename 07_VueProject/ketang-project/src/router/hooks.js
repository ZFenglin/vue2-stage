import store from '@/store/index'
import * as Types from '@/store/modules/action-types'

export default {
    // 字段只是给自己看的，没有其它意义
    'clear_token': async (to, from, next) => {
        store.commit(Types.CLEAR_TOKEN)
        await next()
    }
}