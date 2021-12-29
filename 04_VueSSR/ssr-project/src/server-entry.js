// 服务端入口
import createApp from './app.js'

// 服务端渲染可以返回一个函数
export default () => {
    // 方法再服务端调用
    let { app } = createApp()
    return app
}