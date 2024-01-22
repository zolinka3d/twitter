import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { io } from "socket.io-client";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faComment);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

createApp(App)
  .use(store)
  .use(router)
  .provide("socket", socket)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
