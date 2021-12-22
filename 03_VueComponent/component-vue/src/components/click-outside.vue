<template>
  <div v-if="flag">
    <div class="box" v-click-outside.xx.x="hide">
      <input type="text" @focus="show" />
      <div v-show="isShow">面板</div>
    </div>
  </div>
</template>

<script>
// 指令特点可以复用，核心控制dom,给dom绑定事件
export default {
  directives: {
    clickOutside: {
      // bind+update
      // 绑定时调用
      bind(el, bindings, vnode) {
        console.log("bind");
        // el:绑定的元素,bindings:绑定的属性,vnode:绑定的虚拟节点
        const handler = (e) => {
          if (!el.contains(e.target)) {
            // contains原生方法
            // 点击是外面
            let fn = vnode.context[bindings.expression];
            fn && fn();
          }
        };
        el.handler = handler;
        document.addEventListener("click", el.handler);
      },
      // 解除绑定调用
      unbind(el) {
        console.log("remove");
        document.removeEventListener("click", el.handler);
      },
    },
  },
  data() {
    // 合并为了数据共享，则data使用函数返回对象
    return {
      isShow: false,
      flag: true,
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
  mounted() {
    setTimeout(() => {
      this.flag = false;
    }, 1000);
  },
};
</script>

<style>
.box {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid red;
}
</style>