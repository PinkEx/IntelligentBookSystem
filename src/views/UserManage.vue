<template>
  <div class="user-management">
    <el-table :data="users" v-loading="isLoading" style="width: 100%">
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column prop="username" label="用户名" sortable></el-table-column>
      <el-table-column prop="email" label="邮箱" sortable></el-table-column>
      <el-table-column prop="role" label="角色" sortable></el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 'disabled' ? 'danger' : 'success'">
            {{ scope.row.status == 'disabled' ? 'Blacklisted' : 'Active' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template slot-scope="scope">
          <el-button @click="viewUserDetails(scope.row.id)" type="primary" size="mini">用户详情</el-button>
          <el-button @click="blacklistUser(scope.row.id)" type="danger" size="mini" :disabled="scope.row.status == 'disabled'">拉黑用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="isDialogVisible" title="用户详情">
      <div v-if="selectedUser">
        <p><strong>用户名:</strong> {{ selectedUser.username }}</p>
        <p><strong>邮箱:</strong> {{ selectedUser.email }}</p>
        <p><strong>角色:</strong> {{ selectedUser.role }}</p>
        <p><strong>状态:</strong> {{ selectedUser.status == "disabled" ? "Blacklisted" : "Active" }}</p>
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
      isLoading: true,
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
      await this.$store.dispatch("fetchUserById", id);
      this.selectedUser = this.$store.state.userDetails;
      this.isDialogVisible = true;
    },
    async blacklistUser(id) {
      await this.$store.dispatch("fetchUserById", id);
      this.selectedUser = this.$store.state.userDetails;
      if (confirm('Are you sure you want to blacklist this user?')) {
        console.log(id, this.selectedUser);
        // this.$store.dispatch("blacklistUser", userId);
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
