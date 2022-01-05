<template>
  <div id="app">
    <div>
      我是{{ name }} 年龄增加{{ myAge }}
      <button @click="changeAge(10)">同步更改年龄</button>
      <button @click="changeAgeAsync(20)">异步更改年龄</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "./vuex/index";
export default {
  name: "app",
  // mapXXX返回的是对象
  methods: {
    ...mapMutations(["changeAge"]),
    changeAgeAsync(payload) {
      this.$store.dispatch("changeAge", payload);
    },
  },
  computed: {
    ...mapState(["name"]),
    ...mapGetters(["myAge"]),
  },
};
</script>

<style>
</style>
