<template>
  <!-- 加上app，用于给客户端代码进行绑定连接的 -->
  <div id="app">
    <router-link to="/">foo</router-link>
    <router-link to="/bar">bar</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import Bar from "./components/Bar.vue";
import Foo from "./components/Foo.vue";
export default {
  components: {
    Foo,
    Bar,
  },
};
</script>

<style>
</style>