<template>
 <h1 v-if="!user">
        You are not logged in
    </h1>
    <div v-else class="container">
        <Credentials :user="user"/>
        <router-link to="/profile/update" class="btn btn-primary mb-2 mt-2">Update Profile</router-link>
        <Posts :posts="myPosts" v-if="myPosts.length > 0"/>
    </div>
    
</template>


<script>
    import {mapGetters} from 'vuex';
    import Credentials from './Credentials.vue';
    import Posts from '../posts/Posts.vue';

    export default {
        name: 'Profile',
        computed: {
        ...mapGetters(['user']),
        ...mapGetters(['myPosts'])
    },
        components: {
            Credentials,
            Posts
        },

    }
    
</script>
