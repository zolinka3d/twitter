<template>
    <div v-if="otherUser">
        <Credentials v-if="otherUser" :user="otherUser" class="mb-2"/>
        <div class="d-flex" v-if="otherUser">
            <div>
                <button v-if="otherUser.amIFollowing" class="btn btn-primary" @click="unfollow">Unfollow</button>
                <button v-else class="btn btn-primary" @click="follow">Follow</button>
            </div>
        </div>
    </div>
    <h1 v-else>User not found</h1>
</template>

<script>
import Credentials from './Credentials.vue';
import axios from 'axios';
import {mapGetters} from 'vuex';

export default {
    name: 'FriendProfile',

    data(){
        return {
            otherUser: null,
        }
    },
    components: {
        Credentials
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
            // console.log(response.data);
            this.otherUser = response.data.user;
        }catch(error){
            console.log(error);
        }
    },
    watch:{
        user(newValue, oldValue){
            if(newValue && newValue.username === this.username){
                this.$router.push({name: 'Profile'});
            }
        }
    },
    methods: {
        async follow() {
            try {
                await axios.post(`api/followers/${this.otherUser.username}`);
                this.otherUser.amIFollowing = true;
                const friendsResponse = await axios.get('api/followers')
                this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})
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
            } catch (error) {
                console.log(error);
            }
        }
    },
    
}
</script>