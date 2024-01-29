<template>
    <div class="goUp">
        <button @click.preven="goUp" class="btn btn-primary">Go up</button>
        <div v-if="state.postEvents.length > 0" class="circle">{{ state.postEvents.length }}</div>
    </div>
    <div v-if="user">
        <NewPost/>
        <div class="buttons">
            <button @click.prevent="reload" class="btn btn-primary">Reload</button>
            <button @click.prevent="loadAfter" class="btn btn-primary">Load a few more</button>
        </div>
        
        <div v-if="loading">
            Loading posts...
        </div>
        <div v-else-if="error">
            Error fetching posts: {{ error }}
        </div>
        
        <div v-else-if="posts.length > 0">
            <Posts :posts="posts" @setPostRef="handleSetPostRef"/>
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
import {state} from '../socket/socket'



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
            postsPerPage: 5,
            allPostsLoaded: false,
            bufforPost: null,
            postRefs: {}
        }
    },
    setup(){
        return {state}
     },
    computed: {
        ...mapGetters(['user']),
        ...mapGetters(['posts']),
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
                let response;
                if (this.$store.state.firstPost) {
                    response = await axios.get(`api/posts/home?firstDate=${this.$store.state.lastPost.date}&limit=${this.postsPerPage}`);
                } else {
                    response = await axios.get(`api/posts/home?limit=${this.postsPerPage}`);
                }
                
                if (response.data.posts.length > 0) {
                    const newPosts = response.data.posts;
        
                    
                    const existingPostIds = new Set(this.posts.map(post => post.id));
                    const uniqueNewPosts = newPosts.filter(post => !existingPostIds.has(post.id));
                    
                    this.$store.dispatch('posts', [...this.posts, ...uniqueNewPosts]);
                                    
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
            this.allPostsLoaded = false;
            state.postEvents = [];

            const response = await axios.get(`api/posts/home`);
            this.$store.dispatch('posts', response.data.posts);
        },

        goUp(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            state.postEvents = [];
        },
        handleSetPostRef({ id, el }) {
            this.postRefs[id] = el;
        },
        async loadAfter(){
            this.bufforPost = this.$store.state.firstPost;
           

            const response = await axios.get(`api/posts/home/after`,
            {
                params:{
                    lastDate: this.$store.state.firstPost.date
                }
            });

            this.$store.dispatch('posts', [...response.data.posts, ...this.posts]);
            state.postEvents = [];

            this.$nextTick(() => { // waiting for DOM to render
                const firstPostElement = this.postRefs[this.bufforPost.id];
                if (firstPostElement) {
                    const height = firstPostElement.offsetTop;
                    window.scrollTo({
                        top: height,
                        behavior: 'smooth'
                    });
                }
            });
        }
    },


}
</script>

<style scoped>

.goUp{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    margin: 10px;
}

.circle {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: darkred;
    color: white;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
}

.buttons{
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>