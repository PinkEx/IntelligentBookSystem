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
        <p class="book-introduction"><strong>简介：</strong>{{ book.introduction }}</p>
      </el-card>
    </div>


    <div v-if="_isReader" class="book-actions">
      <el-button type="primary" @click="handleFavorite">
        收藏 <el-badge :value="book.stars" class="item"></el-badge>
      </el-button>
      <el-button type="success" @click="handleBorrow">借阅</el-button>
    </div>

    <div class="book-reviews">
      <h2>读者评价</h2>
      <div class="review-item" v-for="review in book.reviews" :key="review.id">
        <p class="review-content">{{ review.content }}</p>
        <p class="review-author">| by {{ review.author }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {}
    };
  },
  computed: {
    _isReader() {
      return this.$store.state.userType == 0;
    }
  },
  async created() {
    const bookId = this.$route.params.id;
    console.log(bookId);
    await this.$store.dispatch("fetchBookById", bookId);
    this.book = this.$store.state.bookDetails;
    console.log(this.book);
  },
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

.review-item {
  border-top: 2px solid #ddd;
  padding: 5px 0; /* 评价项的内边距 */
  margin-bottom: 5px; /* 评价项的下边距 */
}

.review-item:last-child {
  border-bottom: none; /* 最后一个评价项没有底部边框 */
}

.review-content {
  font-size: 16px; /* 评价内容字体大小 */
  color: #555; /* 评价内容字体颜色 */
  margin-bottom: 5px; /* 评价内容下边距 */
  line-height: 1.5; /* 行高 */
}

.review-author {
  font-size: 14px; /* 作者字体大小 */
  font-style: italic;
  color: #888; /* 作者字体颜色 */
  text-align: right; /* 右对齐 */
}


/* .book-reviews {
  margin-top: 40px;
}

.book-reviews h3 {
  margin-bottom: 20px;
}

.review-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-content {
  margin: 0;
}

.review-author {
  font-size: 0.9em;
  color: #555;
  text-align: right;
  margin-top: 10px;
} */

</style>