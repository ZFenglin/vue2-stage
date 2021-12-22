<template>
  <input type="text" :value="value" @input="handleInput" />
</template>

<script>
export default {
  name: "elInput",
  props: {
    value: String,
  },
  methods: {
    handleInput(e) {
      // 触发v-model的事件
      this.$emit("input", e.target.value);
      this.$dipatch("elFormItem", "changeValue");
    },
  },
};
</script>

<style>
</style>