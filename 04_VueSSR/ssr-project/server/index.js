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
        render.renderToString((err, html) => {
            if (err) {
                reject(err)
            } else {
                resolve(html)
            }
        })
    })
    return ctx
})

// 当客户端发送请求时，会先去dist目录下查找
app.use(static(path.resolve(__dirname, '../dist')))
app.use(router.routes());
app.listen(3000);