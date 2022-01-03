<template>
  <div id="app">
    我是{{ this.$store.state.name }} {{ this.$store.state.age }} <br />
    <!-- 年龄增加{{ this.$store.getters.myAge }} -->
    <button @click="increment">更改年龄</button>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    increment() {
      this.$store.state.age++;
    },
  },
};
</script>

<style>
</style>
