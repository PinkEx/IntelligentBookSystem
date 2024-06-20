
<template>
  <transition name="slide">
    <div v-if="isVisible" class="notification-board">
      <div class="notification-header">
        <p style="font-size: 14px;">通知栏</p>
        <el-button @click="close" size="small" style="height: auto;">关闭</el-button>
      </div>
      <div class="notification-content">
        <p>没有新的通知</p>
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
  methods: {
    close() {
      this.$emit("close");
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
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: transform 0.3s ease;
}
.notification-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.notification-content {
  padding: 10px;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateX(100%);
}
</style>
