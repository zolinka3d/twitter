<template>
    <ul class="list-group">
        <li
            v-for="post in posts"
            :key="post.id"
            class="list-group-item"
            :ref="el => postRef(post, el)"
        >
            <Post :post="post" />
        </li>
    </ul>
</template>


<script>

import Post from "./Post.vue";

export default {
  name: "Posts",
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  components: {
    Post,
  },
  methods: {
    postRef(post, el) {
        if (el) {
            this.$emit('setPostRef', { id: post.id, el });
        }
    }
}
};

</script>