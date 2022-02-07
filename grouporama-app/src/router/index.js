import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Profile from "../views/Profile.vue";
import Thread from "../views/Thread.vue";
import PostDetail from "../views/PostDetail.vue";
import EditPost from "../views/EditPost.vue";
import EditComm from "../views/EditComm.vue";
import Error404 from "../views/Error404.vue";

const checkAuth = () => {
  const userAuth = JSON.parse(localStorage.getItem("userAuth"));
  if (userAuth && userAuth.token && userAuth.token !== "") return true;
  else return false;
};

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
    component: Signup,
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    component: Profile,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "/thread",
    name: "Thread",
    component: Thread,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/messages/:messageId",
    name: "PostDetail",
    component: PostDetail,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "/editpost/:messageId",
    name: "EditPost",
    component: EditPost,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "/messages/:messageId/editcomm/:commentId",
    name: "EditComm",
    component: EditComm,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "*",
    name: "Error404",
    component: Error404,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
