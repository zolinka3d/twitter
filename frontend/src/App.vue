

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
        }
}
</script>

<style>

</style>
