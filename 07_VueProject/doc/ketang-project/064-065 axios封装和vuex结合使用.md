# axios封装和vuex结合使用

## axios封装

```js
/// src/utils/axios.js

import axios from 'axios'

class HttpRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV === 'prodction' ? '/' : 'http://loaclhost:7001'
        this.timeout = 3000
        // loading处理
        this.queue = {} // 专门用来维护请求队列（页面切换时可以取消请求）
    }
    // 拦截器设置
    setInterceptor(instance, url) {
        // 请求拦截
        instance.interceptors.request.use((config) => {
            if (Object.keys(this.queue).length == 0) {
                // open loading
            }
            // 可以记录请求的取消函数
            let CancelToken = axios.CancelToken
            new CancelToken((c) => {
                // c就是当前取消请求的token
            })
            this.queue[url] = true
            return config
        })
        // 响应拦截
        instance.interceptors.response.use((res) => {
            delete this.queue[url] // 一旦响应了，就从队列中删除
            if (Object.keys(this.queue).length == 0) {
                // close loading
            }

            if (res.data.err == 0) {
                return res.data.data
            } else {
                // 失败抛出异常情况
                return Promise.reject(res.data)
            }
        }, (err) => {
            delete this.queue[url]
            if (Object.keys(this.queue).length == 0) {
                // close loading
            }
            return Promise.reject(err)
        })
    }

    request(options) {
        // 每次请求都创建一个新实例，业务不复杂则可以不创建实例
        let instance = axios.create()
        let config = {
            baseURL: this.baseURL,
            timeout: this.timeout,
            ...options
        }
        this.setInterceptor(instance, config.url)
        return instance(config) // 产生的是一个的 promise
    }

    get(url, data = {}) {
        return this.request({
            url,
            method: 'get',
            ...data
        })
    }

    post(url, data = {}) {
        return this.request({
            url,
            method: 'post',
            data
        })
    }
}

export default new HttpRequest()
```

## 接口和vuex结合使用

设置接口 state => action-types => api => actions => mutations

在api文件夹中创建

```js
/// src/api/home.js
import axios from "@/utils/axios";

export const fecthSlides = () => axios.get('/api/slider')
```

stroe中使用api接口对数据进行更新

```js
/// src/store/modules/home/actions.js

import * as Types from '@/store/modules/action-types.js'
import {
    fecthSlides
} from '@/api/home.js'

const homeActions = {
    async [Types.SET_SLIDES](context, payload) {
        let slides = await fecthSlides()
    }
}
export default homeActions
```

## 请求和拦截守卫处理

添加公共状态用于处理请求中的cancel

```js
const store = new Vuex.Store({
    state: { // 公共的状态
        tokens: []
    },
    mutations: {
        [Types.SET_TOKEN](state, token) {
            // 收集tokens
            state.tokens = [...state.tokens, token]
        },
        [Types.CLEAR_TOKEN](state) {
            // 取消所有接口请求，并清空列表tokens
            state.tokens.forEach(token => token());
            state.tokens = []
        }
    },
    modules,
})
export default store
```

接口请求拦截时添加收集

```js
// 请求拦截
instance.interceptors.request.use((config) => {
    if (Object.keys(this.queue).length == 0) {}
    let CancelToken = axios.CancelToken
    new CancelToken((c) => {
        // 请求拦截收集取消方法
        store.commit([Types.SET_TOKEN], c)
    })
    this.queue[url] = true
    return config
})
```

设置路由钩子clear_token，在页面切换是取消请求

```js
import store from '@/store/index'
import * as Types from '@/store/modules/action-types'

export default {
    'clear_token': async (to, from, next) => {
        store.commit(Types.CLEAR_TOKEN)
        await next()
    }
}
```

路由设置

```js
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

Object.values(hooks).forEach(hook => {
    router.beforeEach(hook)
})
```
