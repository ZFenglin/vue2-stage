const Koa = require('koa');
const Router = require('koa-router');
const VueServerRender = require('vue-server-renderer')
const fs = require('fs');
const path = require('path')
const static = require('koa-static')

const app = new Koa();
const router = new Router();

const serverBuild = fs.readFileSync(path.resolve(__dirname, '../dist/server.bundle.js'), 'utf-8');
const template = fs.readFileSync(path.resolve(__dirname, '../dist/server.html'), 'utf-8');
const render = VueServerRender.createBundleRenderer(serverBuild, { template })

router.get('/', async (ctx) => {
    // const html = await render.renderToString() // 但是promise是不支持页面css的，只能使用回调的方式
    ctx.body = await new Promise((resolve, reject) => {
        render.renderToString({ url: ctx.url }, (err, html) => {
            if (err) {
                reject(err)
            } else {
                resolve(html)
            }
        })
    })
})

// 默认先静态目录，没有在查找 / 路径

//  当用户访问不存在服务端路径，就返回给你首页，通过前端的客户端js渲染的时候重新根据路径渲染组件
// 只要用户刷新，就会访问服务器
router.get('/(.*)', async (ctx) => {
    ctx.body = await new Promise((resolve, reject) => {
        render.renderToString({ url: ctx.url }, (err, html) => { // 通过服务端渲染后返回
            if (err && err.code === 404) {
                resolve('404 not found')
            } else {
                resolve(html)
            }
        })
    })
})

// 当客户端发送请求时，会先去dist目录下查找
app.use(static(path.resolve(__dirname, '../dist'))) // 顺序问题
app.use(router.routes());

app.listen(3000);

// 1. 服务端渲染的核心是解析vue的实例，生成字符串返回给浏览器
// 2. 通过webpack打包，把所有的代码都进行打包，返回一个函数，函数执行结果是一个promise => 最终还是vue的实例
// 3. VueServerRender.createBundleRenderer找到webpack打包后的函数，内部会调用这个函数获取到vue的实例，  renderToString生成字符串，返回给浏览器


// createBundleRenderer 调用函数获取实例
// renderToString 根据实例生成一个字符串
// node目的，解析js语法，可以将vue的实例渲染成字符串

// 默认直接通过url 回车输入 => 访问的是服务端的路径，执行服务端渲染
// 后续操作通过浏览器api进行跳转

// 只有首屏才有seo？所有页面都具有服务端渲染，第一次是，后续的用前端路由处理

// 访问过某个网页，我就把整个页面存储到redis里，下次访问直接返回渲染好的html

// router.push()内部重写了，（跳转加组件渲染）

// redis可以消息通知，可以清缓存

// 数据在前端还是后端请求？看你使用场景，希望加载的html的内容很快显示，那就服务端