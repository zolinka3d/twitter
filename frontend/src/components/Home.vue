<template>
    <div v-if="user">
        <NewPost />
        <button @click.prevent="reload" class="btn btn-primary">Reload</button>

        <div v-if="loading">
            Loading posts...
        </div>
        <div v-else-if="error">
            Error fetching posts: {{ error }}
        </div>
        
        <div v-else-if="posts.length > 0">
            <Posts :posts="posts"/>
        </div>
        
        <button v-if="!allPostsLoaded && posts.length > 0" @click.prevent="fetchPosts" class="btn btn-primary">Load more</button>
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
            loading: false,
            error: null,
            page: 1,
            postsPerPage: 5,
            allPostsLoaded: false
        }
    },
    computed: {
        ...mapGetters(['user']),
        ...mapGetters(['posts'])
    },
    created() {
        this.fetchPosts();
    },
    mutations: {
        posts(state, posts) {
            state.posts = posts;
        }
    },
    methods: {
        async fetchPosts() {
            this.error = null;
            try {
                const response = await axios.get(`/api/posts/home?page=${this.page}&limit=${this.postsPerPage}`);
                if (response.data.posts.length > 0) {
                    const newPosts = response.data.posts;
                    const existingPostIds = new Set(this.posts.map(post => post.id));
                    const uniqueNewPosts = newPosts.filter(post => !existingPostIds.has(post.id));

                    this.$store.dispatch('posts', [...this.posts, ...uniqueNewPosts]);
                    this.$store.dispatch('posts', [...this.posts, ...response.data.posts]);
                    this.page++; 
            } else {
                this.allPostsLoaded = true;
            }
            } catch (error) {
                this.error = error.toString();
            } finally {
                this.loading = false;
            }
        },
        async reload(){
            this.page = 1;
            this.allPostsLoaded = false;
            this.$store.dispatch('posts', []);
            await this.fetchPosts();
        },

    },


}
</script>
