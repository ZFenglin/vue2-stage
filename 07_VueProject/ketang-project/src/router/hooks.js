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
    'menu-perission': async (to, from, next) => {
        // 这里需要对权限进行处理，动态路由添加
        if (store.state.user.hasPermission) {
            // 1. 要求用户登录，才能拿去菜单的权限
            if (!store.state.user.menuPermission) {
                // 2. 如果没有菜单权限，则获取菜单权限
                await store.dispatch(`user/${Types.ADD_ROUTE}`) // 路由动态加载，此时组件是异步的 我希望组等待组件加载完成后跳转过去
                next({ ...to, repalce: true }) // 页面重新加载一次, 否则路径再次加载会白屏
            } else {
                next()
            }
        } else {
            next()
        }
    }
}