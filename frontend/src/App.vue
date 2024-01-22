

<template>
  <Nav />
  <div class="container">

        <router-view ></router-view>
      
    </div>
  
</template>

<script>
import Nav from './components/Nav.vue';
import axios from 'axios';
import { inject } from 'vue';

export default {
  name: 'App',
  setup() {
    return {
      socket: inject('socket'),
    }
  },
  components: {
    Nav,
  },
        async created() {
            this.socket.on('connect', () => {
                console.log('connected');
            });
            this.socket.on('post', (msg) => {
                // this.fetchPosts();
                console.log('post received from', msg.from);
            });
            const response = await axios.get('api/user')
            this.$store.dispatch("user", response.data.user)

            this.$store.dispatch("myPosts", response.data.user.posts)
            
            const friendsResponse = await axios.get('api/followers')
            this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})
        }
}
</script>

<style>

</style>
