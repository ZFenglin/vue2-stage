<template>
  <div id="app">
    我是{{ this.$store.state.name }} {{ this.$store.state.age }} <br />
    年龄增加{{ this.$store.getters.myAge }}
    <button @click="$store.commit('changeAge', 2)">同步更改年龄</button>
    <button @click="$store.dispatch('changeAge', 2)">异步更改年龄</button>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
</style>
