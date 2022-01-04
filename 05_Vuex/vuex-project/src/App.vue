<template>
  <div id="app">
    我是{{ this.$store.state.name }} {{ this.$store.state.age }} <br />
    年龄增加{{ this.$store.getters.myAge }}
    <button @click="$store.commit('changeAge', 2)">同步更改年龄</button>
    <button @click="$store.dispatch('changeAge', 2)">异步更改年龄</button>
    <div>
      {{ this.$store.state.a.name }}的年龄
      {{ this.$store.state.a.age }}
      计算
      {{ this.$store.getters["a/myAge"] }}
    </div>
    <button @click="$store.commit('a/changeAge', 2)">同步更改ti年龄</button>
    <div>
      c的年龄
      {{ this.$store.state.a.c.age }}
    </div>
    <button @click="$store.commit('a/c/changeAge', 2)">同步更改c年龄</button>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
</style>
