<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="username"
      name="用户名"
      label="用户名"
      placeholder="用户名"
      :rules="[{ required: true, message: '请填写用户名' }]"
    />
    <van-field
      v-model="password"
      type="password"
      name="密码"
      label="密码"
      placeholder="密码"
      :rules="[{ required: true, message: '请填写密码' }]"
    />
    <div style="margin: 16px" v-if="isLogin">
      <van-button round block type="info" native-type="submit">登录</van-button>
      <br />
      <van-button round block type="primary" to="/reg">去注册</van-button>
    </div>
    <div style="margin: 16px" v-if="isReg">
      <van-button round block type="info" native-type="submit">注册</van-button>
      <br />
    </div>
  </van-form>
</template>

<script>
export default {
  props: {
    submit: {
      type: Function,
      default: () => {
        console.log("onSubmit");
      },
    },
  },
  computed: {
    isLogin() {
      return this.$route.path === "/login";
    },
    isReg() {
      return this.$route.path === "/reg";
    },
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit() {
      this.$emit("submit", {
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>

<style>
</style>