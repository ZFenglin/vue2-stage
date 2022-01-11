<template>
  <div>
    <!-- vue3去掉了async -->
    <home-header v-model="currentCategory"></home-header>
    <!-- 列表需要筛选的条件 -->
    {{ category }} {{ slides }}
  </div>
</template>

<script>
import HomeHeader from "./home-header.vue";
import { createNamespacedHelpers } from "vuex";
import * as Types from "@/store/modules/action-types.js";
let { mapState, mapMutations, mapActions } = createNamespacedHelpers("home");

export default {
  components: {
    HomeHeader,
  },
  methods: {
    ...mapMutations([Types.SET_CATEGORY]),
    ...mapActions([Types.SET_SLIDES]),
  },
  mounted() {
    // 判断store中是否存在数据，决定是否进行数据更新
    if (this.slides.length == 0) {
      this[Types.SET_SLIDES]();
    }
  },
  computed: {
    ...mapState(["category", "slides"]),
    currentCategory: {
      get() {
        return this.category;
      },
      set(value) {
        this[Types.SET_CATEGORY](value);
      },
    },
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