<template>
  <el-form :model="ruleForm" :rule="rules" ref="ruleForm">
    <!-- el-form-item生成label属性，校验label的内容是否合法 -->
    <el-form-item label="用户名" prop="username">
      <!-- v-modle实现双向绑定 等价于:value和@input（或者其他事件） -->
      <el-input v-model="ruleForm.username"></el-input>
      <!-- 等价于 -->
      <!-- <el-input :value="ruleForm.username" @input="(v) => (ruleForm.username = v.target.value)"/> -->
      <!-- 或者  -->
      <!-- <el-input :value="ruleForm.username" @update:value="(v) => (ruleForm.username = v.target.value)"/> -->
      <!-- 等价于 -->
      <!-- <el-input :value.sync="ruleForm.username"/> -->
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <button @click="submitForm">提交</button>
    </el-form-item>
  </el-form>
</template>
<script>
import ElInput from "@/components/form/el-input.vue";
import ElFormItem from "@/components/form/el-form-item.vue";
import ElForm from "@/components/form/el-form.vue";

export default {
  components: {
    "el-input": ElInput,
    "el-form-item": ElFormItem,
    "el-form": ElForm,
  },
  data() {
    return {
      ruleForm: {
        username: "XXX",
        password: "ZZZ",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 3, message: "用户名至少3个字符" },
        ],
        password: [{ required: true, message: "请输入密码" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          console.log("submit!");
          console.log(this.ruleForm);
        } else {
          console.log("error submit!");
        }
      });
    },
  },
};
</script>