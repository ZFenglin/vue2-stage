<template>
  <el-menu>
    <template v-for="item in data">
      <resub :data="item" :key="item.title"></resub>
    </template>
  </el-menu>
</template>

<script>
import ElMenu from "./el-menu.vue";
import ElMenuItem from "./el-menu-item.vue";
import ElSubmenu from "./el-submenu.vue";
import resub from "./resub.vue";
export default {
  props: {
    data: {},
  },
  components: {
    ElMenu,
    ElMenuItem,
    ElSubmenu,
    resub,
  },
};
</script>

<style>
</style>