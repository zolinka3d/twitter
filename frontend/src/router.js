import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/auth/Login.vue";
import Register from "./components/auth/Register.vue";
import Profile from "./components/profile/Profile.vue";
import ProfileUpdate from "./components/profile/ProfileUpdate.vue";
import UploadWidget from "./components/utils/UploadWidget.vue";
import Friends from "./components/friends/Friends.vue";
import FriendProfile from "./components/profile/FriendProfile.vue";
import PostWithReference from "./components/posts/PostWithReference.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/profile/update",
    name: "",
    component: ProfileUpdate,
  },
  {
    path: "/profile/update/avatar",
    name: "UploadWidget",
    component: UploadWidget,
  },
  {
    path: "/friends",
    name: "Friends",
    component: Friends,
  },
  {
    path: "/profile/:username",
    name: "FriendProfile",
    component: FriendProfile,
  },
  {
    path: "/post/:id",
    name: "PostWithReference",
    component: PostWithReference,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
