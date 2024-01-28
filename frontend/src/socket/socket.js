import { reactive } from "vue";
import { io } from "socket.io-client";
import store from "../store/index.js";

export const state = reactive({
  connected: false,
  postEvents: [],
  banEvents: [],
});

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  state.connected = true;
  console.log("Connected to WebSocket!!");
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log("Disconnected from WebSocket!");
});

socket.on("post", (post) => {
  const uniqueId = Date.now();
  const notification = {
    id: uniqueId,
    message: post.from + " added a new post",
  };
  state.postEvents.push(notification);
});

socket.on("ban", (ban) => {
  const uniqueId = Date.now();
  const notification = {
    id: uniqueId,
    message: ban.from + " banned you",
  };
  state.banEvents.push(notification);

  console.log("ban from ", ban.from);
  console.log("ban userId ", ban.userId);

  store.commit("removeUserPosts", ban.from);
  store.commit("removeFriend", ban.from);

  setTimeout(() => {
    state.banEvents.splice(state.banEvents.indexOf(ban.from), 1);
  }, 3000);
});
