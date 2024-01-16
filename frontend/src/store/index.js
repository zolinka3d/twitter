import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
  },
  getters: {
    user: (state) => state.user, // get the current value of the user
  },
  actions: {
    user(context, user) {
      context.commit("user", user); // 'user' refers to the mutation below
    },
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
  },
});
