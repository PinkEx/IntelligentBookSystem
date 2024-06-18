import axios from 'axios'
import bcrypt from 'bcryptjs';
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // general
    isLoading: false,
    isLoggedIn: false,
    // current user
    userType: -1,
    username: null,
    books: [],
    bookDetails: {},
    // for admin
    users: [],
    userDetails: {},
    // for analyst
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_USER_DETAILS(state, user) {
      state.userDetails = user;
    },
    SET_REGISTERED(state, value) {
      state.username = value;
      state.isLoggedIn = true;
      state.userType = 0;
    },
    SET_LOGGED_IN(state, value) {
      state.username = value;
      state.isLoggedIn = true;
      if (value == "admin") state.userType = 1;
      else if (value == "analyst") state.userType = 2;
      else state.userType = 0;
    },
    SET_LOGGED_OUT(state) {
      state.username = null;
      state.isLoggedIn = false;
      state.userType = -1;
    },
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_BOOK_DETAILS(state, book) {
      state.bookDetails = book;
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    }
  },
  actions: {
    // 获取用户列表
    async fetchUsers({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await axios.get("/users.json");
        commit('SET_USERS', response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // 根据用户名获取用户
    async fetchUserByUsername({ commit }, username) {
      commit("SET_LOADING", true);
      var users = this.state.users;
      if (this.state.users.length == 0) {
        try {
          const response = await axios.get("/users.json");
          users = response.data;
        } catch (err) {
          console.error("Failed to fetch users:", err);
          return;
        }
      }
      console.log("!", users);
      try {
        const user = users.find(item => item.username == username);
        commit("SET_USER_DETAILS", user);
      } catch (err) {
        console.error("Failed to fetch user by username:", err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // 用户登录
    async login({ commit }, userData) {
      commit("SET_LOADING", true);
      var users = this.state.users;
      if (this.state.users.length == 0) {
        try {
          const response = await axios.get("/users.json");
          users = response.data;
        } catch (err) {
          console.error("Failed to fetch users:", err);
          return;
        } finally {
          commit("SET_LOADING", false);
        }
      }
      commit("SET_LOADING", true);
      try {
        const user = users.find(user => user.username === userData.username);
        if (!user) {
          throw new Error('User not found');
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashkey = await bcrypt.hash(userData.password, salt);
        // console.log(user, userData, hashkey);
        // const testMatch = await bcrypt.compare(userData.password, hashkey);
        // console.log(testMatch);
        const isMatch = await bcrypt.compare(userData.password, user.hashkey);
        if (!isMatch) {
          throw new Error('Invalid password');
        }
        commit("SET_LOGGED_IN", userData.username);
      } catch (err) {
        console.error('Failed to verify user password:', err);
        throw err;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // 用户注册
    async register({ commit }, userData) {
      commit("SET_REGISTERED", userData.username);
    },
    // 用户登出
    logout({ commit }) {
      commit("SET_LOGGED_OUT");
    },
    // 获取书籍列表
    async fetchBooks({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await axios.get("/books.json");
        commit('SET_BOOKS', response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // 根据id获取书籍
    async fetchBookById({ commit }, id) {
      commit("SET_LOADING", true);
      if (this.state.books.length == 0) {
        try {
          const response = await axios.get("/books.json");
          commit('SET_BOOKS', response.data);
        } catch (err) {
          console.error("Failed to fetch books:", err);
          return;
        }
      }
      try {
        // const response = await axios.get(`/api/book/${id}`);
        // commit("SET_BOOK_DETAILS", response.data);
        const book = this.state.books.find(item => item.id == id);
        commit("SET_BOOK_DETAILS", book);
      } catch (err) {
        console.error("Failed to fetch book by id:", err);
      } finally {
        commit("SET_LOADING", false);
      }
    }
  },
  getters: {
    trendingBooks: state => {
      return state.books.slice(0, 5);
    },
    newBooks: state => {
      return state.books.slice(5, 10);
    },
    recommendBooks: state => {
      return state.books.slice(10, 15);
    }
  }
})

export default store