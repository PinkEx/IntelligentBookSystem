import Vue from "vue"
import Router from "vue-router"

import HomeView from "@/views/HomeView.vue"
import BookSearch from "@/views/BookSearch.vue"
import UserManage from "@/views/UserManage.vue"
import UserLogin from "@/views/UserLogin"
import UserRegister from "@/views/UserRegister.vue"
import UserProfile from "@/views/UserProfile.vue"

import BookDetail from "@/components/BookDetail.vue"

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(locatioon) {
  return originalPush.call(this, locatioon).catch(err => err)
}

export default new Router({
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/login", name: "login", component: UserLogin },
    { path: "/register", name: "register", component: UserRegister },
    { path: "/profile", name: "profile", component: UserProfile },
    { path: "/book/:id", name: "BookDetail", component: BookDetail },
    { path: "/userManage", name: "userManage", component: UserManage },
    { path: "/bookSearch", name: "bookSearch", component: BookSearch }
  ]
})