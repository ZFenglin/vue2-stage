import axios from 'axios'

class HttpRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV === 'prodction' ? '/' : 'http://loaclhost:7001'
        this.timeout = 3000
        // loading 需要加
        this.queue = {} // 专门用来维护请求队列
        // 页面切换，我们需要取消请求
    }
    // 拦截器设置
    setInterceptor(instance, url) {
        // 请求拦截
        instance.interceptors.request.use((config) => {
            if (Object.keys(this.queue).length == 0) {
                // 开启loading
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

    get(url, data) {
        return this.request({
            url,
            method: 'get',
            ...data
        })
    }

    post(url, data) {
        return this.request({
            url,
            method: 'post',
            data
        })
    }

}