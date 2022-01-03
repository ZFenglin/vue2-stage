export let Vue // 导出的是一个变量，即使是基本变量，值也会随同变动

function install(_Vue) {
    Vue = _Vue // 保存当前的Vue
    Vue.mixin({
        beforeCreate() {
            // 获取根组件的store，将它共享给每个组件
            // 每个组件中都应该有$store
            let options = this.$options
            if (options.store) { // 存在这个store属性就是根
                this.$store = options.store
            } else {
                // 先保证为子组件，并且父亲有$store
                if (this.$parent && this.$parent.$store) {
                    this.$store = this.$parent.$store
                }
            }
        }
    })
}
// 父 this.$store => 子 this.$store => 子的子 this.$store

export default install