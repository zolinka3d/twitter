<template>
 <h1 v-if="!user">
        You are not logged in
    </h1>
    <div v-else class="container">
        <Credentials :user="user"/>
        <router-link to="/profile/update" class="btn btn-primary mt-2">Update Profile</router-link>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';
    import Credentials from './Credentials.vue';

    export default {
        name: 'Profile',
        computed: {
        ...mapGetters(['user'])
        },
        components: {
            Credentials
        }
    }
    
</script>
