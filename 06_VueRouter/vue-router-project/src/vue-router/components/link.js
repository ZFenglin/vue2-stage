export default {
    functional: true, // 会导致render函数中没有this，同时没有数据状态data
    // 正常组件是个类 this._init() 如果函数式组件就是一个普通函数
    props: { // 属性校验
        to: {
            type: String,
            required: true
        }
    },
    // render的第二个函数是自己声明的对象
    render(h, { props, slots, parent }) {
        // jsx与react语法一致，<>表示为html，{}表示为js属性
        const click = () => {
            parent.$router.push(props.to)
        }
        return <a onClick={click}>{slots().default}</a>
    }
}