<template>
  <div class="box">
    <li v-for="(l, index) in list" :key="index">
      <img v-lazy="l.url" />
    </li>
  </div>
</template>

<script>
import Vue from "vue";
// import VueLazyload from "vue-lazyload";
import VueLazyload from "./vue-lazy-load";
import logo from "@/assets/logo.png";
// lqip 低质量图片转化
Vue.use(VueLazyload, {
  loading: logo,
  preload: 1, // 1.2屏幕
});

export default {
  data() {
    return {
      list: [],
    };
  },
  // ajax异步
  created() {
    // 服务端渲染仅支持，写在这里保持与服务端渲染一致
  },
  async mounted() {
    // 客户端渲染
    let data = [];
    for (let index = 0; index < 20; index++) {
      data.push({
        url: "https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF",
      });
    }
    this.list = data;
  },
};
</script>

<style>
.box {
  /* background-color: antiquewhite; */
  overflow: scroll;
  height: 500px;
}
img {
  height: 100px;
  width: 300px;
}
</style>