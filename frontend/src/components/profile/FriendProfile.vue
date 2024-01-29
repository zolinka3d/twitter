<template>
    <div v-if="otherUser && otherUser !== 'loading'">
        <Credentials v-if="otherUser" :user="otherUser" class="mb-2"/>
        <div class="d-flex mb-2" v-if="otherUser">
            <div class="buttons">
                <button v-if="otherUser.amIFollowing" class="btn btn-primary" @click="unfollow">Unfollow</button>
                <button v-else-if="!otherUser.amIFollowing && !otherUser.banned" class="btn btn-primary" @click="follow">Follow</button>
                <button v-if="otherUser.banned" class="btn btn-primary" @click="unban">Unban</button>
                <button v-else class="btn btn-primary" @click="ban">Ban</button>
            </div>
        </div>
        <Posts :posts="otherUser.posts" v-if="otherUser.posts.length > 0"/>
    </div>
    <h1 v-else-if="otherUser === 'loading'">Loading...</h1>
    <h1 v-else>User not found</h1>
</template>

<script>
import Credentials from './Credentials.vue';
import Posts from '../posts/Posts.vue';
import axios from 'axios';
import {mapGetters} from 'vuex';
import { socket } from "../../socket/socket";

export default {
    name: 'FriendProfile',

    data(){
        return {
            otherUser: "loading",
            banned: false,
        }
    },
    components: {
        Credentials,
        Posts,
    },
    computed: {
        ...mapGetters(['user']),
        username(){
            return this.$route.params.username;
        }
    },
    async mounted(){
        try{
            const response = await axios.get(`api/followers/profile/${this.username}`);
            if (response.status === 403 && response.data.msg === "User is banned") {
                this.otherUser = null;
                this.banned = true;
            }
            this.otherUser = response.data.user;
        } catch(error){
            console.log(error);
            this.otherUser = null;
        }
    },
    created(){
        if(this.user && this.user.username === this.username){
            this.$router.push({name: 'Profile'});
        }
    },
    methods: {
        async follow() {
            try {
                await axios.post(`api/followers/${this.otherUser.username}`);
                this.otherUser.amIFollowing = true;
                const friendsResponse = await axios.get('api/followers')
                this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})


                // const response = await axios.get(`/api/posts/home`);
                // this.$store.commit('resetPage')
                // this.$store.dispatch('posts', response.data.posts);

            } catch (error) {
                console.log(error);
            }
        },
        async unfollow() {
            try {
                await axios.delete(`api/followers/${this.otherUser.username}`);
                this.otherUser.amIFollowing = false;
                const friendsResponse = await axios.get('api/followers')
                this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})

                // const response = await axios.get(`/api/posts/home`);
                // this.$store.dispatch('posts', response.data.posts);
                
            } catch (error) {
                console.log(error);
            }
        },
        async ban() {
            try {
                await axios.delete(`api/followers/ban/${this.otherUser.username}`);
                this.otherUser.banned = true;
                this.otherUser.amIFollowing = false;

                socket.emit("ban", this.otherUser.username);

                const friendsResponse = await axios.get('api/followers')
                this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})

                // const response = await axios.get(`/api/posts/home`);
                // this.$store.dispatch('posts', response.data.posts);
                
            } catch (error) {
                console.log(error);
            }
        },
        async unban() {
            try {
                await axios.post(`api/followers/unban/${this.otherUser.username}`);
                this.otherUser.banned = false;
                this.otherUser.amIFollowing = false;
                const friendsResponse = await axios.get('api/followers')
                this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})

                // const response = await axios.get(`/api/posts/home`);
                // this.$store.dispatch('posts', response.data.posts);
                
            } catch (error) {
                console.log(error);
            }
        }
    },
    
}
</script>

<style scoped>
    .buttons{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
    }
</style>