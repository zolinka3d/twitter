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
                    Send
                </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { socket } from "../../socket";

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
        console.log(this.quote);
        const response = await axios.post('/api/posts/', {
            text: this.quote.content,
            quote_id: this.quote.post_id,
            reference_id: null,
        });
        this.$store.dispatch('posts', [response.data.post, ...this.$store.getters.posts]);
        this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
        socket.emit("post");
        this.quote.content = "";
    },
  },
};

</script>