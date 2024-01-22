<template>
    <div class="list-group-item mb-5">
        <form @submit.prevent="newPost" class="d-flex ">
            <textarea class="form-control " v-model="content" placeholder="What's on your mind?"></textarea>
            <button class="btn btn-primary">Post</button>
        </form>
    </div>

</template>


<script>

import axios from 'axios';
import { inject } from 'vue';

export default {
    name: "NewPost",
    setup() {
        return {
            socket: inject('socket'),
        }
    },
    data() {
        return {
            content: '',
        }
    },
    created() {
        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('chat message', (msg) => {
            console.log('Message received:', msg);
        });
    }, 
    methods: {
        async newPost() {
            try {
                // const response = await axios.post('/api/posts/', {
                //     text: this.content,
                //     quote_id: null,
                //     reference_id: null,
                // });

                // this.socket.emit('chat message', this.content);
                this.socket.emit("post");

                this.content = '';

                // this.$store.dispatch('posts', [response.data.post, ...this.$store.getters.posts]);
                // this.$store.dispatch('myPosts', [response.data.post, ...this.$store.getters.myPosts]);
            } catch (error) {
                console.log(error);
                this.content = '';
            }
        }
    }

}

</script>