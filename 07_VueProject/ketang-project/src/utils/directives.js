export default {
    'has': {
        inserted(el, bindings, vnode) { // 指令核心为dom操作
            let value = bindings.value; // 用户写的v-has="xx"中的xx
            let permissions = vnode.context.$store.state.user.btnPermission; // 路由上的meta.permissions
            if (!permissions.includes(value)) {
                el.parentNode.removeChild(el);
            }
        }
    }
}