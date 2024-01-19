import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    friends: {
      followers: [],
      following: [],
    },
  },
  getters: {
    user: (state) => state.user, // get the current value of the user
    friends: (state) => state.friends,
  },
  actions: {
    user(context, user) {
      context.commit("user", user); // 'user' refers to the mutation below
    },
    friends(context, friends) {
      context.commit("friends", friends);
    },
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
    friends(state, friends) {
      state.friends = friends;
    },
  },
});
