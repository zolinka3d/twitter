import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  postEvents: [],
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
  state.postEvents.push(post);
  console.log("post from ", post.from);

  setTimeout(() => {
    state.postEvents.splice(state.postEvents.indexOf(post.from), 1);
  }, 3000);
});
