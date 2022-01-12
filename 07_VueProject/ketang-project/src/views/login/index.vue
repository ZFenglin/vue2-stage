<template>
  <div>
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <form-submit @submit="onSubmit"></form-submit>
  </div>
</template>

<script>
import FormSubmit from "@/components/form-submit";
import { createNamespacedHelpers } from "vuex";
import * as Types from "@/store/modules/action-types.js";
let { mapActions } = createNamespacedHelpers("user");
export default {
  components: {
    FormSubmit,
  },
  methods: {
    ...mapActions([Types.SET_LOGIN]),
    onSubmit(data) {
      try {
        this[Types.SET_LOGIN](data);
        this.$router.push("/profile");
      } catch (error) {
        console.log("失败", error);
      }
    },
  },
};
</script>

<style>
</style>