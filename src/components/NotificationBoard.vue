<template>
  <transition name="slide">
    <div v-if="isVisible" class="notification-board">
      <div class="notification-header">
        <p>通知栏</p>
        <el-button @click="close" size="small">关闭</el-button>
      </div>
      <div class="notification-content">
        <div v-for="(notification, index) in this.$store.state.userNotifications" :key="index" class="notification-item"
          :class="{ 'read': notification.isRead }">
          <p>{{ notification.message }}</p>
          <p class="notification-timestamp">{{ formatTimestamp(notification.createTime) }}</p>
          <el-button v-if="!notification.isRead" @click="markAsRead(notification.id)" size="mini"
            type="primary">已读</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  async created() {
    await this.$store.dispatch("fetchUserNotifications");
  },
  methods: {
    close() {
      this.$emit("close");
    },
    markAsRead(id) {
      this.$store.dispatch("setNotificationRead", id);
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp); // Assuming timestamp is in ISO 8601 format
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour12: false })}`;
    }
  }
}
</script>

<style scoped>
.notification-board {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: #fff;
  /* 更改为白色背景 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* 更轻的阴影 */
  z-index: 1000;
  border-left: 1px solid #ddd;
  /* 添加细边框 */
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  /* 浅灰色背景 */
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.notification-header p {
  margin: 0;
  font-size: 16px;
  color: #333;
  /* 深灰色字体 */
}

.notification-content {
  padding: 10px;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.notification-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.notification-item.read {
  opacity: 0.6;
}

.notification-timestamp {
  font-size: 12px;
  color: #999;
  /* 调浅灰色 */
  margin-top: 5px;
}

.el-button {
  margin-top: 10px;
  padding: 6px 12px;
  font-size: 12px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  /* 白色文字 */
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
