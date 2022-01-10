
import LoadingComponent from '@/components/loading.vue'

const loadable = (asyncFunc) => {
    let component = () => ({ // 最终切换的时候会采用这个组件
        component: asyncFunc(),
        loading: LoadingComponent, // 增加loading效果
    })
    return { // loadable执行完成后返回一个组件
        render(h) {
            return h(component)
        }
    }
}

// 路由切换 异步加载的loading
export default loadable