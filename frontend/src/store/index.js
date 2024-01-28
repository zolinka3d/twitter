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
    firstPost: null,
    lastPost: null,
  },
  getters: {
    user: (state) => state.user,
    friends: (state) => state.friends,
    posts: (state) => state.posts,
    myPosts: (state) => state.myPosts,
    page: (state) => state.page,
    firstPost: (state) => state.firstPost,
    lastPost: (state) => state.lastPost,
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
      if (posts.length > 0) {
        context.commit("firstPost", posts[0]);
        context.commit("lastPost", posts[posts.length - 1]);
      }
    },
    myPosts(context, myPosts) {
      context.commit("myPosts", myPosts);
    },
    page(context, page) {
      context.commit("page", page);
    },
    firstPost(context, firstPost) {
      context.commit("firstPost", firstPost);
    },
    lastPost(context, lastPost) {
      context.commit("lastPost", lastPost);
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
    firstPost(state, firstPost) {
      state.firstPost = firstPost;
    },
    lastPost(state, lastPost) {
      state.lastPost = lastPost;
    },
  },
});
