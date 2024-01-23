import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    friends: {
      followers: [],
      following: [],
    },
    posts: [],
    myPosts: [],
  },
  getters: {
    user: (state) => state.user,
    friends: (state) => state.friends,
    posts: (state) => state.posts,
    myPosts: (state) => state.myPosts,
  },
  actions: {
    user(context, user) {
      context.commit("user", user);
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
  },
});
