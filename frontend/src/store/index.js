import { createStore } from "vuex";
// import { inject } from "vue";
// const socket = inject("socket");
// import { io } from "socket.io-client";

// const socket = io(import.meta.env.VITE_API_URL, {
//   withCredentials: true,
// });

export default createStore({
  state: {
    user: null,
    friends: {
      followers: [],
      following: [],
    },
    posts: [],
    myPosts: [],
    isConnected: false,
  },
  getters: {
    user: (state) => state.user, // get the current value of the user
    friends: (state) => state.friends,
    posts: (state) => state.posts,
    myPosts: (state) => state.myPosts,
  },
  actions: {
    user(context, user) {
      context.commit("user", user); // 'user' refers to the mutation below
    },
    friends(context, friends) {
      context.commit("friends", friends);
    },
    posts(context, posts) {
      context.commit("posts", posts);
    },
    myPosts(context, myPosts) {
      context.commit("myPosts", myPosts);
    },
    // connectSocket({ commit }) {
    //   console.log("Connecting to WebSocket...");
    //   socket.on("connect", () => {
    //     console.log("WebSocket connected!");
    //     commit("SOCKET_ONOPEN");
    //   });
    //   socket.on("disconnect", () => {
    //     commit("SOCKET_ONCLOSE");
    //   });
    //   socket.on("error", (error) => {
    //     console.error("WebSocket Error:", error);
    //   });
    // },
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
    friends(state, friends) {
      state.friends = friends;
    },
    posts(state, posts) {
      state.posts = posts;
    },
    myPosts(state, myPosts) {
      state.myPosts = myPosts;
    },
    socket_onopen(state) {
      state.isConnected = true;
    },
    socket_onclose(state) {
      state.isConnected = false;
    },
  },
});
