<template>
  <div id="app">
    <!-- 写一个根据不同的属性生成不同h标签的组件 -->
    <level type="1">11111</level>
    <level type="2">22222</level>

    <my-menu :data="tree"></my-menu>
  </div>
</template>

<script>
import level from "./components/level";
import MyMenu from "./components/my-menu.jsx";

export default {
  components: {
    level,
    MyMenu,
  },
  data() {
    return {
      tree: [
        {
          title: "菜单1",
          children: [
            {
              title: "菜单1-1",
              children: [
                {
                  title: "菜单1-1-1",
                },
              ],
            },
            {
              title: "菜单1-2",
            },
          ],
        },
        {
          title: "菜单2",
          children: [
            {
              title: "菜单2-1",
              children: [
                {
                  title: "菜单2-1-1",
                },
              ],
            },
          ],
        },
        {
          title: "菜单3",
        },
      ],
    };
  },
};
</script>

<style>
</style>
