<template>
  <div class="borrow-history-calendar">
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>借阅历史</span>
      </div> -->
      <el-calendar>
        <template v-slot:dateCell="{ date, data }">
          <div class="custom-date-cell">
            <span v-if="!data.isSelected"
              style="font-size: 20pt; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">{{
              date.getDate() }}</span>
            <div v-if="data.isSelected" class="borrow-history">
              <el-tag v-if="getBorrowedBooksOnDate(date).length" type="warning" size="mini" class="borrow-tag"
                @click="handleTagClick('borrowed', date)">
                借阅中: {{ getBorrowedBooksOnDate(date).length }} 本
              </el-tag>
              <el-tag v-if="getReturnedBooksOnDate(date).length" type="success" size="mini" class="borrow-tag"
                @click="handleTagClick('returned', date)">
                归还: {{ getReturnedBooksOnDate(date).length }} 本
              </el-tag>
              <el-tag v-if="getUnreturnedBooksOnDate(date).length" type="danger" size="mini" class="borrow-tag"
                @click="handleTagClick('unreturned', date)">
                违约中: {{ getUnreturnedBooksOnDate(date).length }} 本
              </el-tag>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-card>

    <el-dialog
      :title="selectedType === 'borrowed' ? '书目-借阅中' : selectedType === 'returned' ? '书目-归还' : '书目-违约中'"
      :visible.sync="dialogVisible"
      width="800px"
      @close="clearSelectedRecords">
      <div class="dialog-content">
        <el-table :data="selectedRecords" border stripe>
          <el-table-column prop="bookName" label="书名" width="200px"></el-table-column>
          <el-table-column prop="lendDate" label="借阅时间" width="200px"></el-table-column>
          <el-table-column prop="duration" label="约定借阅时长" width="200px"></el-table-column>
          <el-table-column v-if="selectedType === 'borrowed'" prop="backDate" label="约定归还时间" width="200px"></el-table-column>
          <el-table-column v-if="selectedType === 'returned'" prop="backDate" label="实际归还时间" width="200px"></el-table-column>
          <el-table-column v-if="selectedType === 'unreturned'" prop="backDate" label="约定归还时间" width="200px"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      borrowHistory: [],
      selectedType: "",
      selectedRecords: [],
      dialogVisible: false,
    };
  },
  async created() {
    await this.$store.dispatch("fetchUserBorrowHistory");
    this.borrowHistory = this.$store.state.userBorrowHistory;
  },
  methods: {
    getBorrowedBooksOnDate(date) {
      return this.borrowHistory.filter((record) => {
        const borrowDate = new Date(record.lendDate);
        const returnDate = new Date(record.backDate);
        const durationInDays = parseInt(record.duration, 10);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + durationInDays);
        return borrowDate <= date && date <= dueDate && date < returnDate;
      });
    },
    getReturnedBooksOnDate(date) {
      return this.borrowHistory.filter((record) => {
        const returnDate = new Date(record.backDate);
        return date.toDateString() == returnDate.toDateString();
      });
    },
    getUnreturnedBooksOnDate(date) {
      return this.borrowHistory.filter((record) => {
        const borrowDate = new Date(record.lendDate);
        const returnDate = new Date(record.backDate);
        const durationInDays = parseInt(record.duration, 10);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + durationInDays);
        return borrowDate <= date && date > dueDate && date < returnDate;
      });
    },
    handleTagClick(type, date) {
      this.selectedType = type;
      if (type === "borrowed") this.selectedRecords = this.getBorrowedBooksOnDate(date);
      else if (type === "returned") this.selectedRecords = this.getReturnedBooksOnDate(date);
      else if (type === "unreturned") this.selectedRecords = this.getUnreturnedBooksOnDate(date);
      this.dialogVisible = true;
    },
    clearSelectedRecords() {
      this.selectedType = "";
      this.selectedRecords = [];
    },
  },
};
</script>

<style scoped>
.borrow-history-calendar {
  padding: 10px;
  background-color: #f5f5f5;
}

.box-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
}

.custom-date-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.borrow-history {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.borrow-tag {
  margin: 1px 0;
  display: inline-block;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-calendar__table {
  min-height: 700px;
}

.el-calendar__body {
  height: 100%;
}

.el-calendar__cell {
  height: 120px;
  box-sizing: border-box;
}

.dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>