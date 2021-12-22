<template>
  <div>
    <label></label>
    <slot></slot>
    <!-- <div>错误消息</div> -->
  </div>
</template>

<script>
export default {
  name: "elFormItem",
  inject: ["elForm"],
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: String,
  },
  methods: {
    validate() {
      // 获取最新的值检测是否合法
      let newValue = this.elForm.model[this.prop];
      let rule = this.elForm.rules[this.prop];
      return true;
    },
  },
};
</script>

<style>
</style>