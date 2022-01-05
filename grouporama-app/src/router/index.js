import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import(/* webpackChunkName: "signup" */ "../views/Signup.vue"),
  },
  {
    path: "/profile/?id=:userId",
    name: "Profile",
    component: () => import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
    beforeEnter: (to, from, next) => {
      if (JSON.parse(localStorage.getItem("userAuth")) && JSON.parse(localStorage.getItem("userAuth")).token) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "/thread",
    name: "Thread",
    component: () => import(/* webpackChunkName: "about" */ "../views/Thread.vue"),
    beforeEnter: (to, from, next) => {
      if (JSON.parse(localStorage.getItem("userAuth")) && JSON.parse(localStorage.getItem("userAuth")).token) next();
      else next({ name: "Home" });
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
