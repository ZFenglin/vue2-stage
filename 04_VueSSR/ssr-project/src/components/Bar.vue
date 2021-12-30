<template>
  <div>
    {{ $store.state.name }}
  </div>
</template>

<script>
export default {
  // 在服务端执行的方法
  asyncData(store) {
    console.log("asyncData");
    return store.dispatch("changeName");
  },
};
</script>

<style  scoped="true">
div {
  background-color: aqua;
}
</style>