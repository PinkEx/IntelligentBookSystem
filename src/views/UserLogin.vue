<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
      <h2 class="login-title">Login</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin()" type="primary" native-type="submit">Login</el-button>
        <el-button @click="resetForm('loginForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: 'Please input your username', trigger: 'blur' }],
        password: [{ required: true, message: 'Please input your password', trigger: 'blur' }],
      },
    };
  },
  methods: {
    async handleLogin() {
      const username = this.loginForm.username;
      const password = this.loginForm.password;
      try {
        await this.$store.dispatch("login", { username, password });
        if (this.$store.state.isLoggedIn) this.$router.push("/");
      } catch (err) {
        alert(err);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 0 auto;
  padding-top: 50px;
  text-align: center;
}

.login-title {
  margin-bottom: 20px;
  text-align: center;
}

.el-form-item {
  text-align: left;
}


</style>