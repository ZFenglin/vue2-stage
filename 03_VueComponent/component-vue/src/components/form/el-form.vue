<template>
  <form @click.prevent>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "elForm",
  provide() {
    return {
      elForm: this,
    };
  },
  props: {
    model: {
      type: Object,
      default: () => ({}), // 保证对象唯一性
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    validate(cb) {
      // 获取所有的Item的校验结果，看是否都是true
      let r = this.$broadcast("elFormItem").every((item) => item.validate());
      cb(r);
    },
  },
};
</script>

<style>
</style>