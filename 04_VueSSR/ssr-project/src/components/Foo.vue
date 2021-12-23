<template>
  <div @click="show">foo</div>
</template>

<script>
export default {
  methods: {
    show() {
      console.log("bar");
    },
  },
};
</script>

<style scoped="true">
div {
  background-color: rosybrown;
}
</style>