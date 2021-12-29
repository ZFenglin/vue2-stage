// 服务端入口
import createApp from './app.js'

// 服务端渲染可以返回一个函数，保证每个客户端请求是获取一个新的实例
export default ({ url }) => { // 服务端调用方法时传入url属性
    return new Promise((resolve, reject) => {
        let { app, router } = createApp()
        // 方法再服务端调用
        // 路由是异步组件，需要等待路由加载完毕
        // app对应的就是new Vue，并没有被路由管理，希望路由跳转完成后，在进行服务端渲染
        // 当用户访问了一个不存在的页面，如何匹配到前端页面
        router.push(url) // 表示路由跳转传入值
        router.onReady(() => { // 等待路由跳转完毕，组件已经准备好触发
            const matchComponents = router.getMatchedComponents() // 获取匹配到的组件
            if (matchComponents.length == 0) {
                return reject({ code: 404 })
            } else {
                resolve(app)
            }
        })
    })
}

// 当用户访问bar时，我在服务端直接进行服务端渲染，渲染后的结果返回给浏览器，浏览器按照路径加载js脚本，重新渲染一次