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
        <h2>Top Trending Books</h2>
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
        <h2>New Arrivals</h2>
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
        <h2>You may also like</h2>
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
    await this.$store.dispatch("fetchBooks");
    this.trendingBooks = this.$store.getters.trendingBooks;
    this.newBooks = this.$store.getters.newBooks;
    this.recommendBook = this.$store.getters.recommendBooks;
    console.log(this.trendingBooks, this.newBooks, this.recommendBooks);
  },
  computed: {
    _isReader() {
      return this.$store.state.userType === 0;
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
}

.content {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
}

.welcome-message {
  text-align: center;
  margin-bottom: 20px;
}

.book-section {
  padding: 10px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 200px; /* Allow Swiper to control the width */
  margin-right: 20px; /* Custom margin for each item */
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
