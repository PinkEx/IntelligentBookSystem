<template>
  <div id="app">
    <el-menu :default-active="$route.path" mode="horizontal" class="menu-wrapper" router>
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item v-if="_isAdmin" index="/borrowManage">借阅管理</el-menu-item>
      <el-menu-item v-if="_isAdmin" index="/userManage">用户管理</el-menu-item>
      <el-menu-item v-if="_isAnalyst" index="/dataDashboard">数据概览</el-menu-item>
      <el-menu-item v-if="_isReader" index="/bookSearch">书籍搜索</el-menu-item>
      <el-submenu v-if="!_isLoggedIn" index="0">
        <template slot="title">注册 & 登录</template>
        <el-menu-item index="/register">注册</el-menu-item>
        <el-menu-item index="/login">登录</el-menu-item>
      </el-submenu>
      <el-submenu v-if="_isLoggedIn" index="1">
        <template slot="title">{{ this.$store.state.username }}</template>
        <el-menu-item v-if="_isReader" index="/profile">个人资料</el-menu-item>
        <el-menu-item @click="_logout">退出</el-menu-item>
      </el-submenu>
      <el-menu-item v-if="true" @click="toggleNotification">🔔</el-menu-item>
    </el-menu>
    <router-view/>
    <NotificationBoard :isVisible="isNotificationVisible" @close="closeNotification" />
  </div>
</template>

<script>
import NotificationBoard from '@/components/NotificationBoard.vue';

export default {
  name: 'App',
  components: {
    NotificationBoard
  },
  data() {
    return {
      isNotificationVisible: false,
    }
  },
  computed: {
    _isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    _isReader() {
      return this.$store.state.userType == 0;
    },
    _isAdmin() {
      return this.$store.state.userType == 1;
    },
    _isAnalyst() {
      return this.$store.state.userType == 2;
    }
  },
  methods: {
    _logout() {
      this.$router.push("/");
      this.$store.dispatch('logout');
    },
    toggleNotification() {
      this.isNotificationVisible = !this.isNotificationVisible;
    },
    closeNotification() {
      this.isNotificationVisible = false;
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.menu-wrapper {
  display: flex;
  justify-content: space-between;
}

.menu-wrapper .el-menu-item,
.menu-wrapper .el-submenu {
  margin-right: 0;
}

.menu-wrapper .el-submenu {
  margin-left: auto;
}
</style>
