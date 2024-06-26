<template>
  <div class="home-view">
    <header class="header">
      <h1>Welcome Home</h1>
    </header>
    <section class="content">
      <div class="welcome-message">
        <h2>Enjoy your stay!</h2>
        <p>Explore a world of knowledge and adventure through our extensive collection of books.</p>
        <p>Whether you are looking for the latest bestsellers or timeless classics, our library has something for every reader.</p>
        <p>Dive into new stories, uncover hidden gems, and expand your horizons with each page you turn.</p>
      </div>

      <div class="book-section">
        <div class="background-overlay"></div>
        <h2 class="sub-header">
          Top Trending Books
        </h2>
        <swiper :options="swiperOptions">
          <swiper-slide class="book-item" v-for="book in trendingBooks" :key="book.id">
            <img :src="book.image" :alt="book.name" class="book-image" />
            <router-link :to="`/book/${book.id}`" class="book-link">
              <h3 class="book-name">{{ book.name }}</h3>
            </router-link>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-rating">
              <span v-for="level in 5" :key="level" class="star" :class="{'filled': level <= book.rating}">★</span>
            </div>
            <div class="book-likes">
              <span class="likes-count">{{ book.stars }}</span>
              <span class="heart">❤️</span>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-next" slot="button-next"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
        </swiper>
      </div>

      <div class="book-section">
        <div class="background-overlay"></div>
        <h2 class="sub-header">
          New Arrivals
        </h2>
        <swiper :options="swiperOptions">
          <swiper-slide class="book-item" v-for="book in newBooks" :key="book.id">
            <img :src="book.image" :alt="book.name" class="book-image" />
            <router-link :to="`/book/${book.id}`" class="book-link">
              <h3 class="book-name">{{ book.name }}</h3>
            </router-link>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-create-time">{{ book.create_time }}上架</p>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-next" slot="button-next"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
        </swiper>
      </div>

      <div class="book-section" v-if="_isReader">
        <div class="background-overlay"></div>
        <h2 class="sub-header">
          You may also like
        </h2>
        <swiper :options="swiperOptions">
          <swiper-slide class="book-item" v-for="book in recommendBook" :key="book.id">
            <img :src="book.image" :alt="book.name" class="book-image" />
            <router-link :to="`/book/${book.id}`" class="book-link">
              <h3 class="book-name">{{ book.name }}</h3>
            </router-link>
            <p class="book-author">{{ book.author }}</p>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-next" slot="button-next"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
        </swiper>
      </div>
    </section>
    <footer class="footer">
      <p>&copy; 2024 Intelligent Book System. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, Pagination, Navigation, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Swiper.use([Pagination, Navigation]);

export default {
  name: 'HomeView',
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      trendingBooks: [],
      newBooks: [],
      recommendBook: [],
      swiperOptions: {
        slidesPerView: "auto",
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  async created() {
    this.trendingBooks = await this.$store.dispatch("fetchTrendingBooks");
    this.newBooks = await this.$store.dispatch("fetchNewBooks");
    this.recommendBook = [];
    console.log(this.trendingBooks, this.newBooks, this.recommendBooks);
  },
  computed: {
    _isReader() {
      return this.$store.state.userType === "user";
    },
  },
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  background-color: #f8f8f8;
  padding: 20px;
  width: 100%;
  text-align: center;
  font-style: normal;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}

.sub-header {
  padding: 10px;
  width: 100%;
  text-align: center;
  font-style: italic;
  font-size: 24px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}

.content {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
}

.welcome-message {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  background-image: url("@/assets/scenary.png");
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: bolder;
  width: 100%;
  color: rgb(95, 127, 63);
}

.book-section {
  position: relative;
  width: 100%;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/envelope.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.4; /* 设置透明度 */
  z-index: -1; /* 确保背景覆盖层在其他内容下面 */
}

.book-section > *:not(.background-overlay) {
  position: relative;
  z-index: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-item {
  background-color: rgba(255, 255, 255, 0.3);
  /* border: 1px solid #ddd; */
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 200px; /* Allow Swiper to control the width */
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-link {
  text-decoration: none;
  color: inherit;
}

.book-link:hover {
  color: #999;
}

.book-image {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.book-name {
  font-size: 1.2em;
  margin: 10px 0;
}

.book-author {
  color: #555;
}

.star {
  color: #ccc; /* Gray for unfilled stars */
}

.star.filled {
  color: #f5c518; /* Yellow for filled stars */
}

.book-likes {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
}

.likes-count {
  font-weight: bold;
}

.book-create-time {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
}
</style>
