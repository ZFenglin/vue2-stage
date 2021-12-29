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