// 服务端入口
import createApp from './app.js'

// 服务端渲染可以返回一个函数，保证每个客户端请求是获取一个新的实例
export default (context) => { // 服务端调用方法时传入url属性
    const { url } = context
    return new Promise((resolve, reject) => {
        let { app, router, store } = createApp()
        // 方法再服务端调用
        // 路由是异步组件，需要等待路由加载完毕
        // app对应的就是new Vue，并没有被路由管理，希望路由跳转完成后，在进行服务端渲染
        // 当用户访问了一个不存在的页面，如何匹配到前端页面
        router.push(url) // 表示路由跳转传入值
        router.onReady(() => { // 等待路由跳转完毕，组件已经准备好触发
            const matchComponents = router.getMatchedComponents()
            // matchComponents 路由匹配到的获取匹配到的组件 （页面级组件）
            if (matchComponents.length == 0) {
                return reject({ code: 404 })
            } else {
                Promise.all(
                    matchComponents.map(component => {
                        // 服务端渲染时候，默认找到页面级组件中的asyncData方法，服务端也会创建一个store实例，并且把store实例传入asyncData方法中 
                        if (component.asyncData) {
                            return component.asyncData(store)
                        }
                    })
                ).then(() => {
                    // 会默认在window下生成一个变量
                    context.state = store.state // 服务器执行完毕后，最新的状态保存在store上
                    resolve(app)
                })
            }
        })
    })
}

// 当用户访问bar时，我在服务端直接进行服务端渲染，渲染后的结果返回给浏览器，浏览器按照路径加载js脚本，重新渲染一次