<template>
    <div v-if="user">
        <NewPost />
        <div v-if="loading">
            Loading posts...
        </div>
        <div v-else-if="error">
            Error fetching posts: {{ error }}
        </div>
        <Posts :posts="posts" v-else-if="posts.length > 0"/>
        <div v-else>
            No posts found.
        </div>
    </div>
    <h1 v-else>
        Please login
    </h1>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import NewPost from './posts/NewPost.vue';
import Posts from './posts/Posts.vue';


export default {
    name: 'Home',
    components: {
    NewPost,
    Posts,

},
    data() {
        return {
            // posts: [],
            loading: false,
            error: null
        }
    },
    computed: {
        ...mapGetters(['user']),
        ...mapGetters(['posts'])
    },
    created() {
        this.fetchPosts();
    },
    methods: {
        async fetchPosts() {
            this.error = null;
            this.loading = true;
            try {
                const response = await axios.get('/api/posts/home');
                // this.posts = response.data.posts
                this.$store.dispatch('posts', response.data.posts);
            } catch (error) {
                this.error = error.toString();
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>
