<template>
    
    <form class="m-2" @submit.prevent="handleSubmit">
        <Error v-if="error" :error="error" />
        <h1>Login</h1>
        <div class="form-group ">
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>


<script>
    import axios from 'axios';
    import Error from '../utils/Error.vue';
    import { socket } from "../../socket/socket";
    

    export default {
        name: 'Login',
        components: {
            Error
        },
        data() {
            return {
                username: '',
                password: '',
                error: ''
            }
        },
        methods: {
            async handleSubmit() {
                try {
                    const data = {
                    username: this.username,
                    password: this.password
                    }

                    const response = await axios.post('api/login', data);

                    const userResponse = await axios.get('api/user')
                    this.$store.dispatch("user", userResponse.data.user)
                    this.$store.dispatch("myPosts", userResponse.data.user.posts)

                    const friendsResponse = await axios.get('api/followers')
                    this.$store.dispatch("friends", {followers: friendsResponse.data.user.followers, following: friendsResponse.data.user.following})
                    
                    socket.connect()
                    this.$router.push('/')

                    
                } catch (error) {
                    this.error = 'Invalid usernare or password'
                }
                
            }
        }
    }

</script>