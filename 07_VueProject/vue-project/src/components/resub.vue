 <template>
  <el-menu-item :key="data.title" v-if="!data.children">
    {{ data.title }}
  </el-menu-item>
  <el-submenu v-else>
    <!-- #title 等价于 v-slot="title" -->
    <template #title>{{ data.title }}</template>
    <template v-for="d in data.children">
      <resub :data="d" :key="d.title"></resub>
    </template>
  </el-submenu>
</template>
 <script>
import ElMenuItem from "./el-menu-item.vue";
import ElSubmenu from "./el-submenu.vue";
export default {
  name: "resub",
  props: {
    data: {},
  },
  components: {
    ElMenuItem,
    ElSubmenu,
  },
};
</script>
 
 <style>
</style>