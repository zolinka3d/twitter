

<template>
  <Nav />
  <div class="container">
   
    <ul class="alert-custom">
      <li v-for="event in state.banEvents" :key="event.id" class="list-group-item">
        <Alert :message="event.message" />
      </li>
    </ul>
      <router-view ></router-view>
      
    </div>
  
</template>

<script>
import Nav from './components/utils/Nav.vue';
import axios from 'axios';
import Alert from './components/utils/Alert.vue';
import { state } from './socket/socket';

export default {
  name: 'App',
  data() {
    return {
      showAlert: false,
    };
  },
  setup(){
    return {state}
  },
  components: {
    Nav,
    Alert,
  },
        async created() {
           
            const response = await axios.get('api/user')
            this.$store.dispatch("user", response.data.user)

            this.$store.dispatch("myPosts", response.data.user.posts)
            
            const friendsResponse = await axios.get('api/followers')
            this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})
        },
}
</script>

<style>
.alert-custom{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  }

</style>
