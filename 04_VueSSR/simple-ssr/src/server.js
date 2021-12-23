const fs = require('fs');
const path = require('path');
const Vue = require('vue');
const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();
const VueServerRenderer = require('vue-server-renderer');

const vm = new Vue({
    data: {
        name: 'zfl'
    },
    template: '<div>hello {{name}}</div>'
});

const template = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');

router.get('/', async (ctx) => {
    // VueServerRenderer一个vue的实例转化为一个字符串并渲染出来
    // 没有所谓的createElement的过程
    ctx.body = await VueServerRenderer.createRenderer({ template }).renderToString(vm);
})

// 将路由注册到应用上
app.use(router.routes());

app.listen(3000, function () {
    console.log('server is running at port 3000');
});

// 服务端每次更改后重新启动服务
// npm i nodemon -g
// nodemon server.js


// 真正开发时还是希望用.vue文件开发