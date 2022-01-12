import store from '@/store/index'
import * as Types from '@/store/modules/action-types'

export default {
    // 字段只是给自己看的，没有其它意义
    'clear_token': async (to, from, next) => {
        store.commit(Types.CLEAR_TOKEN)
        await next()
    },
    'login_permission': async (to, from, next) => {
        let needLogin = to.matched.some(record => record.meta.needLogin)
        // vuex中有值则认为登陆过了
        if (!store.state.user.hasPermission) {
            // 登录校验，返回字段表示是否登陆
            let isLogin = await store.dispatch(`user/${Types.VALIDATE}`)
            if (needLogin) {
                if (!isLogin) {
                    next('/login')
                } else {
                    next()
                }
            } else {
                if (to.name == 'login') {
                    if (!isLogin) {
                        next()
                    } else {
                        next('/profile')
                    }
                } else {
                    next()
                }
            }
        } else {
            if (to.name == 'login') {
                next('/profile')
            } else {
                next()
            }
        }
    },

}