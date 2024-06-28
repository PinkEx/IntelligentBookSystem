<template>
  <div class="profile-container">
    <el-form ref="profileForm" :model="profileForm" :rules="rules" label-width="100px" class="profile-form">
      <el-form-item label="头像">
        <el-upload class="avatar-uploader"
          action="/api/upload"
          name="image"
          :headers="{ token: $store.state.token }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :disabled="!isModifying"
        >
          <img v-if="profileForm.image" :src="profileForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="profileForm.gender" :disabled="!isModifying">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="0">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="profileForm.birthday" type="date" placeholder="选择日期"
          :disabled="!isModifying"></el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" type="email" :disabled="!isModifying">
          <template #prefix>
            <i class="el-icon-s-promotion"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="profileForm.phone" type="tel" :disabled="!isModifying">
          <template #prefix>
            <i class="el-icon-phone"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="邮寄地址">
        <el-input v-model="profileForm.address" :disabled="!isModifying">
          <template #prefix>
            <i class="el-icon-s-home"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isModifying" type="primary" @click="isModifying = true">修改</el-button>
        <el-button v-if="isModifying" type="success" @click="handleSave">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isModifying: false,
      originalProfile: {
        image: "",
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
      },
      profileForm: {
        image: "",
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
      },
      rules: {
        email: [
          { message: 'Please input your email', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              if (!emailReg.test(value)) {
                callback(new Error('请输入正确的邮箱地址'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        phone: [
          { message: 'Please input your phone number', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              const phoneReg = /^1[3-9]\d{9}$/;
              if (!phoneReg.test(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ],
      },
    };
  },
  async created() {
    await this.$store.dispatch("fetchUserDetails", this.$store.state.userId);
    this.originalProfile = this.$store.state.userDetails;
    this.profileForm = {
      image: this.originalProfile.image,
      gender: this.originalProfile.gender,
      birthday: this.originalProfile.birthday,
      email: this.originalProfile.email,
      phone: this.originalProfile.phone,
      address: this.originalProfile.address,
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log("####", res, file);
      this.$store.commit("SET_AVATAR_URL", res.data);
      this.profileForm.image = res.data;
      console.log("####", this.$store.state.userAvatarUrl);
    },
    async handleSave() {
      let success = await this.$store.dispatch("updateUserDetails", this.profileForm);
      if (success) {
        this.$message.success('保存成功');
        this.originalProfile = this.$store.state.userDetails;
      }
      this.isModifying = false;
    },
    handleReset() {
      this.$refs['profileForm'].resetFields();
    }
  }
};
</script>

<style scoped>
.profile-container {
  width: 600px;
  margin: 0 auto;
  padding-top: 50px;
}

.profile-form {
  margin-top: 20px;
}

.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>