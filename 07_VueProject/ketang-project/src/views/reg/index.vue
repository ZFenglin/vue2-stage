<template>
  <div>
    <van-nav-bar
      title="注册"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <form-submit @submit="onSubmit"></form-submit>
  </div>
</template>

<script>
import FormSubmit from "@/components/form-submit";

export default {
  components: {
    FormSubmit,
  },
  methods: {
    onSubmit(data) {
      console.log("注册", data);
    },
  },
};
</script>

<style>
</style>