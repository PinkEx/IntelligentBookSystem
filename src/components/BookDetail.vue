<template>
  <div class="book-detail">

    <div class="book-header">
      <div class="flip-container" :class="{ flipped: isFlipped }" @click="toggleFlip">
        <div class="flipper">
          <div class="front">
            <img v-if="!isFlipped" :src="book.image" class="book-image" />
          </div>
          <div class="back">
            <div v-if="isFlipped" class="wordcloud-container">
              <word-cloud :data="this.tagList" :options="options" name="word-cloud" />
            </div>
          </div>
        </div>
      </div>
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
            出版日期：</strong>{{ book.pubDate }}
        </p>
        <p class="book-pub-date"><strong>
            <i class="el-icon-upload2"></i>
            上架日期：</strong>{{ book.createTime ? book.createTime : "待上架" }}
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
      <el-button v-if="borrowed" type="danger" @click="isDialogVisible = true" size="large">
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
          总体评分：<span v-for="level in 5" :key="level" class="star" :class="{'filled': level <= book.grade}">★</span>
        </div>
      </div>
      <div class="review-item" v-for="review in book.assessList" :key="review.userId">
        <p class="review-content">{{ review.assess }}</p>
        <p class="review-author">
          | by {{ review.userName }} commented on {{ review.updateTime }}
          <span v-for="level in 5" :key="level" class="star" :class="{'filled': level <= review.grade}">★</span>
        </p>
      </div>
    </div>

    <el-dialog v-if="!borrowed" :visible.sync="isDialogVisible" title="确认借阅">
      <div v-if="selectedUser != {}">
        <p><strong>用户名：</strong> {{ selectedUser.username }}</p>
        <p><strong>借阅时间：</strong> {{ currentDate() }}</p>
        <p>
          <strong>借阅天数：</strong>
          <el-input-number v-model="borrowDays" :min="7" :max="60" label="借阅天数"></el-input-number>
        </p>
        <p><strong>约定归还时间：</strong> {{ futureDate() }} </p>
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
          <el-rate v-model="grade" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>
        <p class="left-align"><strong>填写书评：</strong></p>
        <el-input type="textarea" v-model="assess" placeholder="请输入书评" :rows="5"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReturn" type="success" class="center-button">确认</el-button>
        <el-button @click="isDialogVisible = false" type="danger" class="center-button">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WordCloud from 'vue-wordcloud';
export default {
  components: {
    WordCloud,
  },
  data() {
    return {
      book: {},
      isFlipped: false,
      isDialogVisible: false,
      selectedUser: {},
      starred: false,
      borrowed: false,
      lendId: null,
      borrowDays: 20,
      grade: null,
      assess: "",
      tagList: [],
      options: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
        minSize: 1, // 设置最小尺寸为1
        maxSize: 100, // 设置最大尺寸为100或更大
      },
    };
  },
  computed: {
    _isUser() {
      return this.$store.state.role == "user";
    },
  },
  async created() {
    const bookId = this.$route.params.id;
    if (this._isUser) {
      await this.$store.dispatch("fetchBookByIdByUser", bookId);
      this.book = this.$store.state.bookDetails;
      await this.$store.dispatch("fetchUserDetails", this.$store.state.userId);
      this.selectedUser = this.$store.state.userDetails;
      await this.$store.dispatch("fetchUserBorrowHistory");
      this.borrowed = false;
      for (let borrowedBook of this.$store.state.userBorrowHistory) {
        if (borrowedBook.isBack == 0 && borrowedBook.bookId == bookId) {
          this.borrowed = true;
          this.lendId = borrowedBook.id;
        } 
      }
      await this.$store.dispatch("fetchUserLikes");
      this.starred = false;
      for (let likedBook of this.$store.state.userLikes) {
        if (likedBook.bookId == bookId) {
          this.starred = true;
        }
      }
    }
    this.tagList = [
      {name: 'Java', value: 100},
      {name: 'Spring', value: 80},
      {name: 'Hibernate', value: 70},
      {name: 'JavaScript', value: 60},
      {name: 'Vue', value: 50},
      {name: 'TypeScript', value: 40},
      {name: 'HTML', value: 30},
      {name: 'CSS', value: 20},
      {name: 'MySQL', value: 10},
      {name: 'MongoDB', value: 5},
      {name: 'Redis', value: 3},
      {name: 'Spring Boot', value: 2},
      {name: 'Spring Cloud', value: 1},
      {name: 'Docker', value: 1},
      {name: 'Kubernetes', value: 1},
      {name: 'CI/CD', value: 1},
      {name: 'Jenkins', value: 1},
      {name: 'Git', value: 1},
      {name: 'Nginx', value: 1},
      {name: 'Apache', value: 1},
      {name: 'Tomcat', value: 1},
      {name: 'Jira', value: 1},
      {name: 'Confluence', value: 1},
      {name: 'Jenkins X', value: 1},
      {name: 'ArgoCD', value: 1},
      {name: 'Prometheus', value: 1},
      {name: 'Grafana', value: 1},
      {name: 'Istio', value: 1},
      {name: 'OpenTracing', value: 1},
      {name: 'Zipkin', value: 1},
      {name: 'Hystrix', value: 1},
      {name: 'Sentinel', value: 1},
    ]
  },
  methods: {
    toggleFlip() {
      this.isFlipped = !this.isFlipped;
    },
    async handleFavorite() {
      await this.$store.dispatch("setFavorite", !this.starred);
      this.starred = !this.starred;
      const bookId = this.$route.params.id;
      await this.$store.dispatch("fetchBookByIdByUser", bookId);
      this.book = this.$store.state.bookDetails;
    },
    async handleBorrow() {
      let success = await this.$store.dispatch("borrowBook", this.borrowDays);
      if (success) {
        this.isDialogVisible = false;
        this.borrowed = true;
        const bookId = this.$route.params.id;
        await this.$store.dispatch("fetchBookByIdByUser", bookId);
        this.book = this.$store.state.bookDetails;
        window.location.reload();
      }
    },
    async handleReturn() {
      const behavior = {"id": this.lendId, "grade": this.grade, "assess": this.assess};
      let success = await this.$store.dispatch("returnBook", behavior);
      if (success) {
        this.isDialogVisible = false;
        this.borrowed = false;
        const bookId = this.$route.params.id;
        await this.$store.dispatch("fetchBookByIdByUser", bookId);
        this.book = this.$store.state.bookDetails;
        window.location.reload();
      }
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
      futureDate.setDate(now.getDate() + this.borrowDays);
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

.flip-container {
  position: relative;
  display: flex;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  transform-origin: center center;
  cursor: pointer;
  perspective: 1000px;
  flex: 1;
}

.flip-container.flipped {
  transform: rotateY(180deg);
}

.flipper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.front,
.back {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  justify-content: center;
  align-items: center;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}

.book-image {
  top: 0;
  left: 0;
  width: 300px;
  height: auto;
}

.wordcloud-container {
  top: 0;
  left: 0;
  width: 300px;
  height: auto;
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