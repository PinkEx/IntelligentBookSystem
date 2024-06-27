<template>
  <div class="book-search-container">
    <el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline">
      <el-form-item label="书名">
        <el-input v-model="searchForm.name" placeholder="请输入书名"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchForm.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="语言">
        <el-input v-model="searchForm.language" placeholder="请输入语言"></el-input>
      </el-form-item>
      <el-form-item label="价格区间">
        <el-input-number v-model="searchForm.lowerPrice" :min="0" :max="1000"></el-input-number>
        元~
        <el-input-number v-model="searchForm.upperPrice" :min="0" :max="1000"></el-input-number>
        元
      </el-form-item>
      <el-form-item label="出版区间">
        <el-date-picker v-model="searchForm.beginPubDate" type="date"></el-date-picker>
        ~
        <el-date-picker v-model="searchForm.endPubDate" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="searchForm.category" placeholder="请选择类别">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item v-if="_isUser">
        <el-checkbox v-model="searchForm.starred">已收藏</el-checkbox>
        <el-checkbox v-model="searchForm.borrowed">借阅中</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table :data="filteredBooks" class="book-table">
        <el-table-column fixed="left" prop="name" label="书名" align="center" width="240"></el-table-column>
        <el-table-column prop="author" label="作者" align="center" width="auto"></el-table-column>
        <el-table-column prop="press" label="出版社" align="center" width="auto"></el-table-column>
        <el-table-column prop="language" label="语言" align="center" width="auto"></el-table-column>
        <el-table-column prop="category" label="类别" align="center" width="auto"></el-table-column>
        <el-table-column prop="pub_date" label="出版日期" align="center" width="auto"></el-table-column>
        <el-table-column prop="create_time" label="上架时间" align="center" width="auto"></el-table-column>
        <el-table-column prop="number" label="库存（套）" align="center" width="auto"></el-table-column>
        <el-table-column prop="price" label="价格（元）" align="center" width="auto"></el-table-column>
        <el-table-column fixed="right" label="统计" align="center" width="240">
          <el-table-column prop="rating" label="综合评分" align="center" width="80" sortable></el-table-column>
          <el-table-column prop="stars" label="收藏次数" align="center" width="80" sortable></el-table-column>
          <el-table-column prop="lend_frequency" label="借阅次数" align="center" width="80" sortable></el-table-column>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" :width="_isUser ? 240 : 80">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small">查看</el-button>
            <el-button v-if="_isUser" @click="handleClick(scope.row)" type="primary" size="small">收藏</el-button>
            <el-button v-if="_isUser && scope.row.number > 0" @click="handleClick(scope.row)" type="success" size="small">借阅</el-button>
            <el-button v-if="_isUser && scope.row.number == 0" @click="handleClick(scope.row)" type="info" size="small" disabled>暂缺</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookSearch",
  data() {
    return {
      searchForm: {
        name: "",
        author: "",
        language: "",
        lowerPrice: 0,
        upperPrice: 999,
        category: "",
        starred: "",
        borrowed: ""
      },
      categories: [
        { value: '1', label: '默认' },
        { value: '2', label: '测试' },
        { value: '3', label: '更新类别' },
      ],
      filteredBooks: [],
    };
  },
  async created() {
    await this.$store.dispatch("fetchBooks");
  },
  computed: {
    _isUser() {
      return this.$store.state.role == "user";
    }
  },
  methods: {
    async handleSearch() {
      await this.$store.dispatch("searchBooks", this.searchForm);
      this.filteredBooks = [];
      if (this.searchForm.category != "") {
        for (let book of this.$store.state.filteredBooks) {
          if (book.classId == this.searchForm.category) {
            this.filteredBooks.push(book);
          }
        }
      } else {
        this.filteredBooks = this.$store.state.filteredBooks;
      }
      if (this.searchForm.starred) {
        await this.$store.dispatch("fetchUserLikes");
        this.filteredBooks = this.filteredBooks.filter(filteredBook => {
          for (let likedBook of this.$store.state.userLikes) {
            if (filteredBook.id == likedBook.bookId) return true;
          }
          return false;
        });
      }
      if (this.searchForm.borrowed) {
        await this.$store.dispatch("fetchUserBorrowHistory");
        this.filteredBooks = this.filteredBooks.filter(filteredBook => {
          for (let borrowedBook of this.$store.state.userBorrowHistory) {
            if (filteredBook.id == borrowedBook.bookId && borrowedBook.isBack == 0) return true;
          }
          return false;
        });
      }
    },
    async handleReset() {
      this.$refs["searchForm"].resetFields();
      this.searchForm = {
        name: "",
        author: "",
        language: "",
        lowerPrice: 0,
        upperPrice: 999,
        category: "",
        starred: "",
        borrowed: ""
      },
      await this.handleSearch(this.searchForm);
    },
    handleClick(row) {
      console.log(row);
      this.$router.push(`/book/${row.id}`);
    }
  },
};
</script>

<style scoped>
.book-search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.demo-form-inline .el-form-item {
  margin-right: 20px;
  margin-bottom: 10px;
}

.table-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.book-table {
  width: 800px; /* 限制表格宽度 */
}

.book-table .el-table__header-wrapper {
  display: flex;
  justify-content: center;
}

.book-table .el-table__header {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
