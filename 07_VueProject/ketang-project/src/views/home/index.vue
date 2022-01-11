<template>
  <div>
    <!-- vue3去掉了async -->
    <home-header v-model="value"></home-header>
    <!-- 列表需要筛选的条件 -->
  </div>
</template>

<script>
import HomeHeader from "./home-header.vue";
export default {
  components: {
    HomeHeader,
  },
  data() {
    // 全部课程 -1 node课程 0 react课程 1 vue课程 2
    return {
      value: -1,
    };
  },
};
</script>

<style>
</style>