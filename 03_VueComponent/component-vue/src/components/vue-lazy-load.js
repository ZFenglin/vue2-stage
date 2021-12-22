import _ from 'lodash';
const VueLazyLoad = {
    install(Vue, options) {
        const LazyClass = lazy(Vue);
        let instance = new LazyClass(options);
        Vue.directive('lazy', {
            // 所有的指令调用的都是add
            bind: instance.add.bind(instance), // 类的方法赋值使用则this会变更，所以需要bind
            unbind: instance.remove.bind(instance)
        })
    }
}

const scrollPareny = (el) => {
    let parent = el.parentNode; // TODO 父级获取不到
    // let overflow = getComputedStyle(parent)['overflow'];
    // while (parent) {
    //     if (/scroll/.test(overflow)) {
    //         return parent;
    //     }
    //     parent = parent.parentNode;
    // }
    return parent.parentNode;
}

const render = (listener, status) => {
    let el = listener.el
    let src = ''
    switch (status) {
        case 'loading':
            src = listener.options.loading;
            break;
        case 'loaded':
            src = listener.src;
            break;
        case 'error':
            src = listener.options.error;
            break;
    }
    el.setAttribute('src', src);
}

const loadImg = (src, resolve, reject) => {
    let img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
}

const lazy = (Vue) => {
    class ReactiveListener {
        constructor({ el, src, options }) {
            this.el = el;
            this.src = src;
            this.state = { loading: false }
            this.options = options;
        }
        checkInView() {
            // 检测是否在可视区域
            // 获取当前元素距离屏幕的位置
            let { top } = this.el.getBoundingClientRect(); // getBoundingClientRect获取当前元素的位置
            return top < window.innerHeight * this.options.preload; // 可视区域的高度
        }
        load() {
            // 加载图片
            //先显示loading图，再去加载真实照片，图片失败显示失败内容
            render(this, 'loading');
            loadImg(this.src, () => {
                this.state.loading = true
                render(this, 'loaded');
            }, () => {
                this.state.loading = true
                render(this, 'error');
            })
        }
    }


    // todo vue的操作
    return class LazyClass {
        constructor(options) {
            this.options = options;
            this.bindHandler = false;
            this.listeners = [];
        }
        lazyLoadHandler() {
            // 看一下那些需要加载
            this.listeners.forEach((listener) => {
                if (listener.state.loading) return;
                // 元素处于可视区域, 则调用加载方法
                listener.checkInView() && listener.load();
            })

        }
        add(el, binding, vnode) {
            Vue.nextTick(() => {
                let ele = scrollPareny(el);
                // 1. 监控el是否需要现实
                let listener = new ReactiveListener({ el, src: binding.value, options: this.options });
                this.listeners.push(listener);

                if (ele && !this.bindHandler) {
                    // 2. 绑定滚动事件
                    // 降低频率用节流
                    let throttle = _.throttle(this.lazyLoadHandler.bind(this), 500);
                    ele.addEventListener('scroll', throttle, {
                        passive: true
                    });
                    this.bindHandler = true;
                }
                this.lazyLoadHandler(); // 初始化加载
            })
        }
        remove(el, binding, vnode) { }
    }
}

export default VueLazyLoad