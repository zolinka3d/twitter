<template>
    <div class="container mt-2">
        <form @submit.prevent="createComment" class="d-flex">
                <textarea
                class="form-control"
                id="content"
                v-model="comment.content"
                placeholder="Write a comment"
                ></textarea>
                <button type="submit" class="btn btn-primary">
                    Send
                </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { socket } from "../../socket/socket";

export default {
  
  name: "NewComment",
  data() {
    return {
      comment: {
        content: "",
        post_id: this.$route.params.id,
      },
    };
  },
  methods: {
    async createComment() {
        const response = await axios.post('/api/posts/', {
            text: this.comment.content,
            quote_id: null,
            reference_id: this.$route.params.id,
        });
        const postsResponse = await axios.get('api/posts/home')
        this.$store.dispatch('posts', postsResponse.data.posts);
        this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
        
        socket.emit("post");
        this.$emit("newComment", response.data.post);
        this.comment.content = "";
    },
  },
};

</script>