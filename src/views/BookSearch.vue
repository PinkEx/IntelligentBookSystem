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
          <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="_isUser">
        <el-checkbox v-model="searchForm.starred">已收藏</el-checkbox>
        <el-checkbox v-model="searchForm.borrowed">借阅中</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button @click="handleInsert">新增书籍</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table :data="filteredBooks" class="book-table">
        <el-table-column fixed="left" prop="name" label="书名" align="center" width="240"></el-table-column>
        <el-table-column prop="author" label="作者" align="center" width="auto"></el-table-column>
        <el-table-column prop="press" label="出版社" align="center" width="auto"></el-table-column>
        <el-table-column prop="language" label="语言" align="center" width="auto"></el-table-column>
        <el-table-column prop="className" label="类别" align="center" width="auto"></el-table-column>
        <el-table-column prop="pubDate" label="出版日期" align="center" width="auto"></el-table-column>
        <el-table-column prop="createTime" label="上架时间" align="center" width="auto"></el-table-column>
        <el-table-column v-if="!_isUser" prop="number" label="库存（套）" align="center" width="auto"></el-table-column>
        <el-table-column prop="price" label="价格（元）" align="center" width="auto"></el-table-column>
        <el-table-column fixed="right" label="统计" align="center" width="240">
          <el-table-column prop="grade" label="综合评分" align="center" width="80" sortable></el-table-column>
          <el-table-column prop="stars" label="收藏次数" align="center" width="80" sortable></el-table-column>
          <el-table-column prop="lendFrequency" label="借阅次数" align="center" width="80" sortable></el-table-column>
        </el-table-column>
        <el-table-column v-if="_isUser" fixed="right" label="状态" align="center" width="160">
          <template slot-scope="scope">
            <span v-if="_isUser && scope.row.number > 0" style="color: #67C23A;">可借阅</span>
            <span v-if="_isUser && scope.row.number == 0" style="color: #F56C6C;">暂缺</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" :width="_isUser ? 80 : 160">
          <template slot-scope="scope">
            <el-button @click="handleCheck(scope.row)" size="small">查看</el-button>
            <el-button v-if="!_isUser" @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增书籍" :visible.sync="isDialogVisible" width="30%">
      <el-form :model="insertedBook" label-width="120px" class="book-insert-form">
        <el-form-item label="书名">
          <el-input v-model="insertedBook.name" style="width: 200px;">
            <template #prefix>
              <i class="el-icon-reading"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="insertedBook.author" style="width: 200px;">
            <template #prefix>
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="insertedBook.press" style="width: 200px;">
            <template #prefix>
              <i class="el-icon-office-building"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="insertedBook.isbn" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="封面图片URL">
          <el-input v-model="insertedBook.image" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="insertedBook.introduction" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="insertedBook.language" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）">
          <el-input v-model="insertedBook.price" style="width: 200px;">
            <template #prefix>
              <i class="el-icon-coin"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker v-model="insertedBook.pubDate" type="date" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="insertedBook.classId" placeholder="请选择类别" style="width: 200px;">
            <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量（套）">
          <el-input-number v-model="insertedBook.number" style="width: 200px;" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleInsertConfirm">确定</el-button>
      </div>
    </el-dialog>
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
        beginPubDate: "",
        endPubDate: "",
        category: "",
        starred: "",
        borrowed: ""
      },
      categories: [
        { value: "1", label: "古典" },
        { value: "2", label: "文学" },
        { value: "3", label: "科幻" },
        { value: "4", label: "政治" },
        { value: "5", label: "历史" },
        { value: "6", label: "社科" },
        { value: "7", label: "儿童文学" },
        { value: "8", label: "悬疑推理" },
        { value: "9", label: "小说" },
        { value: "10", label: "神话史诗" },
        { value: "11", label: "奇幻文学" },
        { value: "12", label: "武侠世界" },
        { value: "13", label: "人物传记" },
        { value: "14", label: "散文诗歌" },
        { value: "15", label: "哲学" },
        { value: "16", label: "纪实文学" },
        { value: "17", label: "其他" },
        { value: "18", label: "经济管理" },
      ],
      filteredBooks: [],
      isDialogVisible: false,
      insertedBook: {
        "name": "",
        "author": "",
        "press": "",
        "isbn": "",
        "image": "",
        "introduction": "",
        "language": "",
        "price": 0,
        "pubDate": "",
        "classId": "",
        "number": 0,
      }
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
      {
        const tempBooks = this.filteredBooks;
        this.filteredBooks = [];
        for (let book of tempBooks) {
          if (this.searchForm.lowerPrice <= book.price && book.price <= this.searchForm.upperPrice) {
            this.filteredBooks.push(book);
          }
        }
      }
      if (this.searchForm.beginPubDate != "" && this.searchForm.endPubDate != "") {
        const tempBooks = this.filteredBooks;
        this.filteredBooks = [];
        for (let book of tempBooks) {
          if (this.searchForm.beginPubDate <= book.pubDate && book.pubDate <= this.searchForm.endPubDate) {
            this.filteredBooks.push(book);
          }
        }
      }
      if (this._isUser && this.searchForm.starred) {
        await this.$store.dispatch("fetchUserLikes");
        this.filteredBooks = this.filteredBooks.filter(filteredBook => {
          for (let likedBook of this.$store.state.userLikes) {
            if (filteredBook.id == likedBook.bookId) return true;
          }
          return false;
        });
      }
      if (this._isUser && this.searchForm.borrowed) {
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
        beginPubDate: "",
        endPubDate: "",
        category: "",
        starred: "",
        borrowed: ""
      },
      await this.handleSearch();
    },
    handleInsert() {
      this.isDialogVisible = true;
    },
    handleCheck(row) {
      this.$router.push(`/book/${row.id}`);
    },
    async handleDelete(row) {
      if (confirm("确认删除该书籍？")) {
        await this.$store.dispatch("deleteBook", row.id);
        this.$message.success("删除成功");
        await this.$store.dispatch("fetchBooks");
        await this.handleSearch();
      }
    },
    async handleInsertConfirm() {
      await this.$store.dispatch("insertBook", this.insertedBook);
      this.$message.success("书籍添加成功");
      this.isDialogVisible = false;
      await this.$store.dispatch("fetchBooks");
      await this.handleSearch();
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
