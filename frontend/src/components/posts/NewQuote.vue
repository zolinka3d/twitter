<template>
    <div class="container mt-2">
        <form @submit.prevent="createQuotePost" class="d-flex">
                <textarea
                class="form-control"
                id="content"
                v-model="quote.content"
                placeholder="Quote"
                ></textarea>
                <button type="submit" class="btn btn-primary">
                <font-awesome-icon icon="quote-right" />
                </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { socket } from "../../socket/socket";

export default {
  name: "NewQuote",
  data() {
    return {
      quote: {
        content: "",
        post_id: this.$route.params.id,
      },
    };
  },
  methods: {
    async createQuotePost() {
        const response = await axios.post('/api/posts/', {
            text: this.quote.content,
            quote_id: this.$route.params.id,
            reference_id: null,
        });

        const postsResponse = await axios.get('api/posts/home')
        this.$store.dispatch('posts', postsResponse.data.posts);
        
        this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
        socket.emit("post");
        this.quote.content = "";
    },
  },
};

</script>