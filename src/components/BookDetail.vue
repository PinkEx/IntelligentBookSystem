<template>
  <div class="book-detail">
    
    <div class="book-header">
      <img :src="book.image" class="book-image" />
      <el-card class="book-info">
        <h1 class="book-name">
          {{ book.name }}
          <span class="book-author">{{ book.author }} 著</span>
        </h1>
        <p class="book-press">
          <i class="el-icon-s-home"></i>
          <strong>出版社：</strong>{{ book.press }}
        </p>
        <p class="book-language">
          <i class="el-icon-s-custom"></i>
          <strong>语言：</strong>{{ book.language }}
        </p>
        <p class="book-price">
          <i class="el-icon-price-tag"></i>
          <strong>价格：</strong>{{ book.price }}元
        </p>
        <p class="book-pub-date"><strong>
          <i class="el-icon-date"></i>
          出版日期：</strong>{{ book.pub_date }}
        </p>
        <p class="book-pub-date"><strong>
          <i class="el-icon-upload2"></i>
          上架日期：</strong>{{ book.create_time ? book.create_time : "待上架" }}
        </p>
        <p class="book-introduction"><strong>简介：</strong>{{ book.introduction }}</p>
      </el-card>
    </div>

    <div v-if="_isUser" class="book-actions">
      <el-button v-if="!starred" type="primary" @click="handleFavorite" size="large">
        收藏 <el-badge :value="book.stars" class="item"></el-badge>
      </el-button>
      <el-button v-if="starred" type="primary" @click="handleFavorite" size="large">
        取消收藏 <el-badge class="item"></el-badge>
      </el-button>
      <el-button v-if="!borrowed && book.number > 0" type="success" @click="isDialogVisible = true" size="large">
        借阅 <el-badge :value="book.lend_frequency" class="item"></el-badge>
      </el-button>
      <el-button v-if="borrowed" type="success" @click="isDialogVisible = true" size="large">
        归还 <el-badge class="item"></el-badge>
      </el-button>
      <el-button v-if="book.number == 0" type="info" size="large" disabled>
        暂缺
      </el-button>
    </div>

    <div class="book-reviews">
      <div class="reviews-header">
        <h2>读者评价</h2>
        <div>
          总体评分：<span v-for="level in 5" :key="level" class="star" :class="{'filled': level <= book.rating}">★</span>
        </div>
      </div>
      <div class="review-item" v-for="review in book.reviews" :key="review.id">
        <p class="review-content">{{ review.content }}</p>
        <p class="review-author">
          | by {{ review.author }}
          <span v-for="level in 5" :key="level" class="star" :class="{'filled': level <= review.rating}">★</span>
        </p>
      </div>
    </div>

    <el-dialog v-if="!borrowed" :visible.sync="isDialogVisible" title="确认借阅">
      <div v-if="selectedUser != {}">
        <p><strong>用户名：</strong> {{ selectedUser.username }}</p>
        <p><strong>借阅时间：</strong> {{ currentDate() }}</p>
        <p><strong>（最迟）归还时间：</strong> {{ futureDate() }} </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBorrow" type="success" class="center-button">确认</el-button>
        <el-button @click="isDialogVisible = false" type="danger" class="center-button">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="borrowed" :visible.sync="isDialogVisible" title="确认归还">
      <div v-if="selectedUser != {}">
        <p class="left-align"><strong>用户名：</strong>{{ selectedUser.username }}</p>
        <div class="rating-container">
          <p class="left-align rating-text"><strong>评分：</strong></p>
          <el-rate v-model="rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>
        <p class="left-align"><strong>填写书评：</strong></p>
        <el-input
          type="textarea"
          v-model="review"
          placeholder="请输入书评"
          :rows="5"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReturn" type="success" class="center-button">确认</el-button>
        <el-button @click="isDialogVisible = false" type="danger" class="center-button">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {},
      isDialogVisible: false,
      selectedUser: {},
      starred: false,
      borrowed: false,
      rating: 0,
      review: ""
    };
  },
  computed: {
    _isUser() {
      return this.$store.state.role == "user";
    }
  },
  async created() {
    const bookId = this.$route.params.id;
    if (this._isUser) {
      await this.$store.dispatch("fetchBookByIdByUser", bookId);
      this.book = this.$store.state.bookDetails;
      await this.$store.dispatch("fetchUserDetails");
      this.selectedUser = this.$store.state.userDetails;
    }
    // check borrow state
    this.borrowed = false;
  },
  methods: {
    async handleFavorite() {
      await this.$store.dispatch("setFavorite", !this.starred);
      this.starred = !this.starred;
    },
    async handleBorrow() {
      await this.$store.dispatch("borrowBook");
    },
    async handleReturn() {
      await this.$store.dispatch("returnBook");
    },
    currentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${date}`;
      return formattedDate;
    },
    futureDate() {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + 15);
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const date = String(futureDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${date}`;
      return formattedDate;
    }
  }
};
</script>

<style scoped>
.book-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.book-header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
}

.book-image {
  width: 300px;
  height: auto;
  margin-right: 40px;
}

.book-info {
  flex: 1;
}

.book-name {
  font-size: 24px;
  margin: 0;
}

.book-author {
  font-size: 16px;
  font-style: italic;
  margin-left: 10px;
  color: gray;
}

.book-introduction {
  margin: 20px 0;
  text-align: left;
}

.el-button {
  height: 48px;
  line-height: 24px;
}

.book-reviews {
  background-color: #f9f9f9; /* 浅灰色背景 */
  border-radius: 8px; /* 圆角边框 */
  padding: 20px; /* 内边距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  margin-top: 20px; /* 上边距 */
}

.book-reviews h2 {
  font-size: 24px; /* 标题字体大小 */
  margin-bottom: 15px; /* 标题下边距 */
  color: #333; /* 标题字体颜色 */
}

.star {
  color: #ccc; /* Gray for unfilled stars */
}

.star.filled {
  color: #f5c518; /* Yellow for filled stars */
}

.review-item {
  border-top: 2px solid #ddd;
  padding: 5px 0;
  margin-bottom: 5px;
}

.review-content {
  font-size: 16px; /* 评价内容字体大小 */
  color: #555; /* 评价内容字体颜色 */
  margin-bottom: 5px; /* 评价内容下边距 */
  line-height: 1.5; /* 行高 */
  text-align: left;
  white-space: pre-wrap; /* 允许文字换行，并保留空格和换行符 */
  word-wrap: break-word; /* 文字自动换行 */
}

.review-author {
  font-size: 14px; /* 作者字体大小 */
  font-style: italic;
  color: #888; /* 作者字体颜色 */
  text-align: right; /* 右对齐 */
}

.reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px; /* 添加间距 */
}

.book-rating {
  font-size: 12px;
  color: #888;
}

.rating-scale {
  font-size: 10px;
  margin-left: 5px;
}

.left-align {
  text-align: left;
}

.rating-container {
  display: flex;
  align-items: center;
}

.rating-text {
  margin-right: 10px;
}
</style>