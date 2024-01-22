<template>

<form class="m-2" @submit.prevent="handleSubmit">
        <error v-if="error" :error="error" />
        <h1>Update Profile</h1>
        <div class="form-group ">
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" class="form-control" id="email" placeholder="Enter email">
        </div>
        <router-link to="/profile/update/avatar" class="btn btn-secondary">Update Avatar</router-link>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>

</template>

<script>
    import Error from './Error.vue';
    import axios from 'axios';
export default {
   

    name: 'ProfileUpdate',
    data() {
            return {
                username: '',
                password: '',
                email: '',
                error: ''
            }
        },
    components: {
        Error
    },
    methods: {
        async handleSubmit(){
            try {

                const data = {
                    username: this.username,
                    password: this.password,
                    email: this.email
                }
                const response = await axios.put('api/profile', data);
                const posts = this.$store.state.user.posts
                this.$store.dispatch("user", {
                    username: response.data.user.username,
                    email: response.data.user.email,
                    avatar: response.data.user.avatar,
                    posts: posts
                });
                this.$router.push('/profile')
            } catch (error) {
                this.error = error.response.data.msg;
            }
        }
    }

}

</script>