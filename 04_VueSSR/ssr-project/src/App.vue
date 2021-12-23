<template>
  <div>
    <Foo></Foo>
    <Bar></Bar>
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