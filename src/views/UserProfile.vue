<template>
  <div class="profile-container">
    <el-form ref="profileForm" :model="profileForm" :rules="rules" label-width="100px" class="profile-form">
      <!-- <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :http-request="onImport"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="性别">
        <el-radio-group v-model="profileForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
          <el-radio label="0">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="profileForm.birthday" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" type="email">
          <template #prefix>
            <i class="el-icon-s-promotion"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="profileForm.phone" type="tel">
          <template #prefix>
            <i class="el-icon-phone"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="邮寄地址">
        <el-input v-model="profileForm.address">
          <template #prefix>
            <i class="el-icon-s-home"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="自我介绍">
        <el-input type="textarea" v-model="profileForm.bio"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      profileForm: {
        avatar: "",
        gender: "",
        birthday: "",
        email: "",
        phone: "",
        address: "",
        bio: ""
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
    await this.$store.dispatch("fetchUserByUsername", this.$store.state.username);
    this.profileForm = this.$store.state.userDetails;
  },
  methods: {
    onImport({ file }) {
      let form = new FormData()
      form.append("file", file);
      console.log(file, form);
      // this.$api.uploadFile(form).then((res) => {
      //   let { code, data } = res;
      //   if (code == 200) {
      //     this.imageUrl = data;
      //     console.log("上传成功");
      //   } else {
      //     console.log("上传失败");
      //   }
      // })
    },
    handleAvatarSuccess(res, file) {
      console.log("####", res, file);
      this.profileForm.avatar = URL.createObjectURL(file.raw);
      console.log(file, file.raw);
    },
    handleSave() {
      this.$message.success('保存成功');
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