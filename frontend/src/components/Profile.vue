<template>
 <h1 v-if="!user">
        You are not logged in
    </h1>
    <div v-else class="container">
        <div class="row">
            <div class="col-md-6">
                <h3>Username</h3>
                <p>{{ user.username }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3>Email</h3>
                <p>{{ user.email }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3>Avatar</h3>
                <img v-if="user.avatar" :src="user.avatar" alt="avatar" class="img"/>
                <p v-else>No avatar</p>
            </div>
        </div>
        <router-link to="/profile/update" class="btn btn-primary mt-2">Update Profile</router-link>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Profile',
        computed: {
        ...mapGetters(['user'])
        }
    }
    
</script>