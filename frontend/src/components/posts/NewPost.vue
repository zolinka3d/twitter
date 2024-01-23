<template>
    <div class="list-group-item mb-5">
        <form @submit.prevent="newPost" class="d-flex ">
            <textarea class="form-control " v-model="content" placeholder="What's on your mind?"></textarea>
            <button class="btn btn-primary">Post</button>
        </form>
    </div>

</template>


<script>
import { socket } from "../../socket/socket";
import axios from 'axios';

export default {
    name: "NewPost",
    data() {
        return {
            content: '',
        }
    },
    methods: {
        async newPost() {
            try {
                const response = await axios.post('/api/posts/', {
                    text: this.content,
                    quote_id: null,
                    reference_id: null,
                })
                socket.emit("post")

                this.content = '';

                this.$store.dispatch('posts', [response.data.post, ...this.$store.getters.posts]);
                this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
            } catch (error) {
                console.log(error);
                this.content = '';
            }
        }
    }

}

</script>