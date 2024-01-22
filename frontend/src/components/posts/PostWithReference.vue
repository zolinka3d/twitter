<template>
    <div class="container" v-if="post && post!='error'">
        <Posts :posts="post.posts" v-if="post.posts.length > 0"/>
        <NewQuote/>
        <NewComment @newComment="handleNewComment"/>
        <div class="container" v-if="post.comments.length > 0">
            <Posts :posts="post.comments" />
        </div>
    </div>
    <div class="container" v-else>
        <h1>Post not found</h1>
    </div>
</template>


<script>
import axios from 'axios';
import Posts from '../posts/Posts.vue';
import NewComment from './NewComment.vue';
import NewQuote from './NewQuote.vue';

export default {
  name: "PostWithReference",
  components: {
    Posts,
    NewComment,
    NewQuote,
  },
  data(){
    return {
        post: null,
    }
  },
  computed:{
    id(){
        return this.$route.params.id;
    }
  },
  async mounted(){
    this.fetchPost();
  },
  watch: {
    id(newId, oldId) {
      if (newId !== oldId) {
        this.fetchPost();
      }
    },
  },
  methods: {
    async fetchPost() {
      try{
        console.log(this.id);
        const response = await axios.get(`api/posts/${this.id}`);
        this.post = response.data;
        console.log(this.post);
      } catch(error) {
        console.log(error);
        this.post = "error"
      }
    },
    handleNewComment(newComment) {
      this.post.comments.unshift(newComment);
    },
  }
};
</script>