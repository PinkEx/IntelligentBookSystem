<template>
  <div class="user-management">
    <el-table :data="users" v-loading="this.$store.state.isLoading" style="width: 100%" height="600">
      <el-table-column v-if="false" prop="id" label="ID" sortable width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="90"></el-table-column>
      <el-table-column prop="lendFrequency" label="借阅次数" sortable width="100"></el-table-column>
      <el-table-column prop="disFrequency" label="违约次数" sortable width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" sortable width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" sortable width="120"></el-table-column>
      <el-table-column prop="address" label="地址" sortable width="120"></el-table-column>
      <el-table-column prop="isEnabled" label="状态" sortable width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
            {{ scope.row.isEnabled ? "Active" : "Blacklisted" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="240px">
        <template slot-scope="scope">
          <el-button @click="viewUserDetails(scope.row.id)" type="primary" size="mini">用户详情</el-button>
          <el-button v-if="scope.row.isEnabled" @click="blacklistUser(scope.row.id)" type="danger"
            size="mini">拉黑用户</el-button>
          <el-button v-if="!scope.row.isEnabled" @click="unblockUser(scope.row.id)" type="warning"
            size="mini">解除拉黑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="isDialogVisible" title="用户详情">
      <div v-if="selectedUser">
        <p><strong>用户名:</strong> {{ selectedUser.username }}</p>
        <p><strong>邮箱:</strong> {{ selectedUser.email }}</p>
        <p><strong>手机号:</strong> {{ selectedUser.phone }}</p>
        <p><strong>地址:</strong> {{ selectedUser.address }}</p>
        <p><strong>状态:</strong> {{ selectedUser.isEnabled ? "Active" : "Blacklisted" }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDialogVisible: false,
      selectedUser: null
    };
  },
  computed: {
    users() {
      return this.$store.state.users;
    }
  },
  async created() {
    await this.$store.dispatch("fetchUsers");
  },
  methods: {
    async viewUserDetails(id) {
      await this.$store.dispatch("fetchUserDetails", id);
      this.selectedUser = this.$store.state.tempUserDetails;
      if (this.selectedUser) {
        this.isDialogVisible = true;
      } else {
        this.$message.error("用户详情获取失败");
      }
    },
    async blacklistUser(id) {
      if (confirm("Are you sure you want to blacklist this user?")) {
        const result = await this.$store.dispatch("setBlacklistedUser", id);
        if (result) {
          await this.$store.dispatch("fetchUsers");
          this.$message.success("用户已拉黑");
        } else {
          this.$message.error("拉黑操作失败");
        }
      }
    },
    async unblockUser(id) {
      if (confirm("Are you sure you want to unblock this user?")) {
        const result = await this.$store.dispatch("setUnblockedUser", id);
        if (result) {
          await this.$store.dispatch("fetchUsers");
          this.$message.success("用户解除拉黑");
        } else {
          this.$message.error("解除拉黑失败");
        }
      }
    }
  }
};
</script>

<style scoped>
.user-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
</style>
