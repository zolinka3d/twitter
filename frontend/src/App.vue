

<template>
  <Nav />
  <div class="container">

        <router-view ></router-view>
      
    </div>
  
</template>

<script>
import Nav from './components/Nav.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Nav,
  },
        async created() {
            const response = await axios.get('api/user')
            this.$store.dispatch("user", response.data.user)
            
            const friendsResponse = await axios.get('api/followers')
            this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})
        }
}
</script>

<style>

</style>
