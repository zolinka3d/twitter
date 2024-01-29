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
                const response = await axios.post('api/posts/', {
                    text: this.content,
                    quote_id: null,
                    reference_id: null,
                })
                socket.emit("post")

                this.content = '';

                const postsResponse = await axios.get('api/posts/home');
                this.$store.dispatch('posts', postsResponse.data.posts);
                
                this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
            } catch (error) {
                console.log(error);
                this.content = '';
            }
        }
    }

}

</script>