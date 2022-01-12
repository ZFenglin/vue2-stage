import * as Types from '@/store/modules/action-types'
import { toLogin, validate } from '@/api/user'
import per from '@/router/permission.js'
import router from '@/router/index.js'

const filterRouter = (router, authList) => {
    // 可以扁平化过滤，然后保存
    function filter(router) {
        let res = router.filter(route => {
            if (authList.includes(route.meta.auth)) {
                if (route.children) {
                    route.children = filter(route.children)
                }
                return route
            }
        })
        return res
    }
    return filter(router)
}

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
            let userInfo = await validate(localStorage.getItem('token'))
            dispatch(Types.SET_USER, { userInfo, has: true })
            return true
        } catch (error) {
            dispatch(Types.SET_USER, { userInfo: {}, has: false })
            return false
        }
    },
    async [Types.ADD_ROUTE]({ commit, state }, payload) {
        // 添加路由逻辑
        let authList = state.authList
        let routes = filterRouter(per, authList);
        let route = router.options.routes.find(item => item.path == '/profile')
        route.children = routes // 动态添加儿子
        router.addRoutes([route]) // 动态再次添加路由
        commit(Types.SET_MENU_PERMISSION, true)
    },
}

export default userActions