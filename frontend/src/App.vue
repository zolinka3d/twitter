

<template>
  <Nav />
  <div class="container">
    <Alert :username="alertUsername" v-if="showAlert" class="alert"/>
        <router-view ></router-view>
      
    </div>
  
</template>

<script>
import Nav from './components/Nav.vue';
import axios from 'axios';
import { inject } from 'vue';
import Alert from './components/Alert.vue';

export default {
  name: 'App',
  data() {
    return {
      showAlert: false,
      alertUsername: '',
    };
  },
  setup() {
    return {
      socket: inject('socket'),
    }
  },
  components: {
    Nav,
    Alert,
  },
        async created() {
            this.socket.on('connect', () => {
                console.log('connected');
            });
            this.socket.on('post', (msg) => {
                this.alertUsername = msg.from;
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
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
.alert{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;}

</style>
