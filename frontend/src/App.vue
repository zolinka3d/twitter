

<template>
  <Nav />
  <div class="container">
   
    <ul class="alert">
      <li v-for="event in state.postEvents" :key="event.id" class="list-group-item">
        <Alert :username="event.from" :post="event.post" :type="event.type" :id="event.id"/>
      </li>
    </ul>
      <router-view ></router-view>
      
    </div>
  
</template>

<script>
import Nav from './components/Nav.vue';
import axios from 'axios';
import Alert from './components/Alert.vue';
import { state } from './socket';

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
.alert{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  }

</style>
