<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="80px">
      <h2 class="register-title">register</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="password again" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleregister()" type="primary" native-type="submit">register</el-button>
        <el-button @click="resetForm('registerForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    async handleregister() {
      const username = this.registerForm.username;
      const password = this.registerForm.password;
      const confirmPassword = this.registerForm.confirmPassword;
      if (password != confirmPassword) return;
      try {
        await this.$store.dispatch("register", { username, password });
        console.log(this.$store);
        if (this.$store.state.isLoggedIn) this.$router.push("/");
        else alert("用户名或密码错误!");
      } catch (error) {
        console.error("register failed:", error);
        alert("请求超时!");
      }
    },
    resetForm(formName) {
      console.log(this.$refs);
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 300px;
  margin: 0 auto;
  padding-top: 50px;
  text-align: center;
}

.register-title {
  margin-bottom: 20px;
  text-align: center;
}

.el-form-item {
  text-align: left;
}
</style>