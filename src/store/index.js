import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import { jwtDecode } from 'jwt-decode';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // current user states
    isLoading: false,
    token: null,
    userId: null,
    role: null,
    // general
    books: [],
    trendingBooks: [],
    newBooks: [],
    filteredBooks: [],
    bookDetails: {},
    // for users
    userNotifications: [],
    recommendBooks: [],
    userAvatarUrl: "",
    userLikes: [],
    userBorrowHistory: [],
    // for admins
    users: [],
    userDetails: {},
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_USER_DETAILS(state, user) {
      state.userDetails = user;
    },
    SET_USER_NOTIFICATIONS(state, notifications) {
      state.userNotifications = notifications;
    },
    SET_AVATAR_URL(state, url) {
      state.userAvatarUrl = url;
    },
    SET_LOGGED_IN(state, role) {
      state.role = role;
    },
    SET_LOGGED_OUT(state) {
      state.role = null;
      state.token = null;
      state.userId = null;
      state.books = [];
      state.trendingBooks = [];
      state.newBooks = [];
      state.filteredBooks = [];
      state.bookDetails = {};
      state.userNotifications = [];
      state.recommendBooks = [];
      state.userAvatarUrl = "";
      state.userLikes = [];
      state.userBorrowHistory = [];
      state.users = [];
      state.userDetails = {};
    },
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_TRENDING_BOOKS(state, books) {
      state.trendingBooks = books;
    },
    SET_NEW_BOOKS(state, books) {
      state.newBooks = books;
    },
    SET_RECOMMEND_BOOKS(state, books) {
      state.recommendBooks = books;
    },
    SET_FILTERED_BOOKS(state, books) {
      state.filteredBooks = books;
    },
    SET_BOOK_DETAILS(state, book) {
      state.bookDetails = book;
    },
    SET_USER_BORROW_HISTORY(state, history) {
      state.userBorrowHistory = history;
    },
    SET_USER_LIKES(state, likes) {
      state.userLikes = likes;
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      state.userId = jwtDecode(token).id;
    },
  },
  actions: {
    // 管理员获取用户列表
    async fetchUsers({ commit }) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.get("/api/admins/users");
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit('SET_USERS', response.data.data.rows);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户登录
    async login({ commit }, userData) {
      commit("SET_LOADING", true);
      let success = false, role = userData.username == "yqy" ? "admin": "user";
      try {
        const response = await axios.post("/api/login", {
          username: userData.username,
          password: userData.password,
          role: role,
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_LOGGED_IN", role);
          const token = response.data.data;
          localStorage.setItem("token", token);
          commit("SET_TOKEN", token);
        }
      } catch (err) {
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户注册
    async register({ commit }, userData) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.post("/api/register", {
          "username": userData.username,
          "password": userData.password,
        });
        if (response.status == 200 && response.data.code == 1) success = true;
        console.log(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户登出
    logout({ commit }) {
      localStorage.clear();
      commit("SET_LOGGED_OUT");
    },
    // 获取用户个人详细信息
    async fetchUserDetails({ commit }, id) {
      commit("SET_LOADING", true);
      let success = false, path = this.role == "admin" ? `/api/admins/users/${id}` : `/api/users/${id}`;
      try {
        const response = await axios.get(path, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          commit("SET_USER_DETAILS", response.data.data);
          success = true;
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 获取用户通知
    async fetchUserNotifications({ commit }) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.get(`/api/users/notifications/${this.state.userDetails.id}`, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_USER_NOTIFICATIONS", response.data.data.rows);
        }
      } catch (err) {
        console.error("Failed to fetch user notifications:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 标记通知已读
    async setNotificationRead({ commit }, id) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.put(`/api/users/notifications/setIsRead`, {
          ids: [id]
        }, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
      } catch (err) {
        console.error("Failed to set notification read:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      if (success) success = await this.dispatch("fetchUserNotifications");
      return success;
    },
    // 更新用户个人信息
    async updateUserDetails({ commit }, userData) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.put("/api/users/updateUser", {
          id: parseInt(this.state.userDetails.id),
          username: userData.username,
          image: userData.image,
          gender: userData.gender,
          address: userData.address,
          phone: userData.phone,
          email: userData.email
        }, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
      } catch (err) {
        console.error("Failed to update user details:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      if (success) success = await this.dispatch("fetchUserDetails", this.state.userDetails.id);
      return success;
    },
    // 用户获取书籍列表
    async fetchBooks({ commit }) {
      commit("SET_LOADING", true);
      let success = false, path = this.state.role == "admin" ? " " : "/api/admins/books";
      try {
        const response = await axios.get(path, {
          page: 1,
          pageSize: 100
        }, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
        commit('SET_BOOKS', response.data.data.rows);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户根据id获取书籍信息
    async fetchBookByIdByUser({ commit }, id) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.get(`/api/users/book/${id}`, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
        commit("SET_BOOK_DETAILS", response.data.data);
      } catch (err) {
        console.error("Failed to fetch book by id", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户借阅书籍
    async borrowBook({ commit }, duration) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.post("/api/users/lend/saveLend", {
          userId: this.state.userDetails.id,
          bookId: this.state.bookDetails.id,
          duration: duration
        }, {
          headers: {
            token: this.state.token
          }
        }
        );
        if (response.status == 200 && response.data.code == 1) success = true;
      } catch (err) {
        console.error("Failed to borrow book:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户归还书籍
    async returnBook({ commit }, userBehavior) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.put("/api/users/lend/back", {
          id: userBehavior.id,
          grade: userBehavior.grade,
          assess: userBehavior.assess
        }, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
      } catch (err) {
        console.error("Failed to return book:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户借阅历史
    async fetchUserBorrowHistory({ commit }) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.get(`/api/users/lends/${this.state.userDetails.id}`, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_USER_BORROW_HISTORY", response.data.data.rows);
        }
      } catch (err) {
        console.error("Failed to fetch user borrow history", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户收藏列表
    async fetchUserLikes({ commit }) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.get(`/api/users/isLike/${this.state.userDetails.id}`, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_USER_LIKES", response.data.data.rows);
        }
      } catch (err) {
        console.error("Failed to fetch user likes", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 用户收藏/取消收藏书籍
    async setFavorite({ commit }, isLike) {
      commit("SET_LOADING", true);
      let success = false;
      try {
        const response = await axios.put("/api/users/stars", {
          userId: this.state.userDetails.id,
          bookId: this.state.bookDetails.id,
          isLike: isLike ? 1 : 0
        }, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) success = true;
      } catch (err) {
        console.error("Failed to (un)set favorite book:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 获取 trending books
    async fetchTrendingBooks({ commit }) {
      commit("SET_LOADING", true);
      let success = false, path = this.state.role == "admin" ? "/api/admins/booksByUp" : "/api/users/booksByUp";
      try {
        const response = await axios.get(path, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_TRENDING_BOOKS", response.data.data.listResult);
        }
      } catch (err) {
        console.error("Failed to get trending books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 获取 new books
    async fetchNewBooks({ commit }) {
      commit("SET_LOADING", true);
      let success = false, path = this.state.role == "admin" ? "/api/admins/booksByTime" : "/api/users/booksByTime";
      try {
        const response = await axios.get(path, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_NEW_BOOKS", response.data.data.listResult);
        }
      } catch (err) {
        console.error("Failed to fetch new books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    // 获取 recommend books
    async fetchRecommendBooks({ commit }) {
      commit("SET_LOADING", true);
      let success = false, path = "/api/users/booksRecommend";
      try {
        const response = await axios.get(path, {
          headers: {
            token: this.state.token
          }
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_RECOMMEND_BOOKS", response.data.data.listResult);
        }
      } catch (err) {
        console.error("Failed to fetch recommend books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    async searchBooks({ commit }, form) {
      commit("SET_LOADING", true);
      let success = false, path = `/api/users/books?name=${form.name}&author=${form.author}&language=${form.language}&lowerPrice=${form.lowerPrice}&upperPrice=${form.upperPrice}&category=${form.category}`;
      try {
        const response = await axios.get(path, {
          headers: {
            token: this.state.token
          },
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_FILTERED_BOOKS", response.data.data.rows);
        }
      } catch (err) {
        console.error("Failed to search books:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      return success;
    },
    async uploadAvatar({ commit }, file) {
      commit("SET_LOADING", true);
      let success = false, path = "/api/upload";
      try {
        const response = await axios.post(path, {
          image: file
        }, {
          headers: {
            token: this.state.token
          },
        });
        if (response.status == 200 && response.data.code == 1) {
          success = true;
          commit("SET_AVATAR_URL", response.data.data);
        }
      } catch (err) {
        console.error("Failed to upload avatar:", err);
      } finally {
        commit("SET_LOADING", false);
      }
      if (success) success = await this.dispatch("fetchUserDetails", this.state.userDetails.id);
      return success;
    }
  },
  plugins: [createPersistedState()],
})

export default store