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
    page: 1,
  },
  getters: {
    user: (state) => state.user,
    friends: (state) => state.friends,
    posts: (state) => state.posts,
    myPosts: (state) => state.myPosts,
    page: (state) => state.page,
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
    page(context, page) {
      context.commit("page", page);
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
    removeUserPosts(state, username) {
      // console.log(state.posts.length);

      state.posts = state.posts.filter((post) => {
        return post.user.username !== username;
      });
    },
    removeFriend(state, username) {
      state.friends.following = state.friends.following.filter((user) => {
        return user.username !== username;
      });
      state.friends.followers = state.friends.followers.filter((user) => {
        return user.username !== username;
      });
    },
    page(state, page) {
      state.page = page;
    },
    addPage(state) {
      state.page++;
    },
    resetPage(state) {
      state.page = 2;
    },
  },
});
