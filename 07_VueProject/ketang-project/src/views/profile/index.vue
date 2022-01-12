<template>
  <div class="profile">
    <van-nav-bar title="个人中心"></van-nav-bar>
    <div class="profile-info">
      <template>
        <img src="@/assets/logo.png" alt="" />
        <van-button size="small" to="/login">登录</van-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.profile {
  .profile-info {
    display: flex;
    align-items: center;
    height: 150px;
    padding: 0 15px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
}
</style>