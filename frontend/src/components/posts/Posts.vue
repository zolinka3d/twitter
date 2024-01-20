<template>
    <ul class="list-group">
        <li
            v-for="post in posts"
            :key="post.id"
            class="list-group-item"
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
};

</script>