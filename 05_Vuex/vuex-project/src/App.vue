<template>
  <div id="app">
    <div>
      我是{{ this.$store.state.name }} {{ this.$store.state.age }} 年龄增加{{
        this.$store.getters.myAge
      }}
      <button @click="$store.commit('changeAge', 2)">同步更改年龄</button>
      <button @click="$store.dispatch('changeAge', 2)">异步更改年龄</button>
    </div>
    <div>
      {{ this.$store.state.a.name }}的年龄
      {{ this.$store.state.a.age }}
      计算
      {{ this.$store.getters["a/myAge"] }}
      <button @click="$store.commit('a/changeAge', 2)">同步更改ti年龄</button>
    </div>
    <div>
      c的年龄
      {{ this.$store.state.a.c.age }}
      <button @click="$store.commit('a/c/changeAge', 2)">同步更改c年龄</button>
    </div>
    <div>
      {{
        $store.state.b &&
        $store.state.b.name +
          ":" +
          $store.state.b.age +
          ":" +
          $store.getters.bAge
      }}
      <button @click="registerModule">动态注册模块</button>
    </div>
  </div>
</template>

<script>
import store from "./store/index";

export default {
  name: "app",
  methods: {
    registerModule() {
      // 但是最后都会转化为数组
      store.registerModule("b", {
        state: {
          name: "registerModule",
          age: 30,
        },
        getters: {
          bAge(state) {
            return state.age + 1;
          },
        },
      });
    },
  },
};
</script>

<style>
</style>
