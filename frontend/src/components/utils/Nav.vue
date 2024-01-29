<template>
<nav class="navbar navbar-expand-lg bg-primary justify-content-between mb-2">
    <router-link to="/" class="navbar-brand text-light">Y</router-link>

    <div class="d-flex" v-if="!user">
        <router-link to="/login" class="nav-link text-light">Login</router-link>
        <router-link to="/register" class="nav-link text-light">Register</router-link>
    </div>
    <div class="d-flex" v-else>
        <router-link to="/friends" class="nav-link text-light">Friends</router-link>
        <router-link to="/profile" class="nav-link text-light">Profile</router-link>
        <a href="#" @click="handleClick" class="nav-link text-light">Logout</a >
    </div>
    
</nav>

</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex';
    import { socket } from '../../socket/socket';
export default {
    
    name: 'Nav',
    methods: {
        handleClick() {
            axios.delete('api/logout');
            socket.disconnect()
            this.$store.commit("resetState");

            this.$router.push('/login');
        }
    },
    computed: {
        ...mapGetters(['user'])
    }
}
</script>