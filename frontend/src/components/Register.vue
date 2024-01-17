<template>
    <form class="m-2" @submit.prevent="handleSubmit">
        <h1>Register</h1>
        <error v-if="error" :error="error" />
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="form-group ">
            <label for="email">Email</label>
            <input type="text" v-model="email" class="form-control" id="email" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input type="password" v-model="password2" class="form-control" id="password2" placeholder="Confirm password">
        </div>
        <button  class="btn btn-primary" >Submit</button>
    </form>

</template>

<script>
import axios from 'axios';
import Error from './Error.vue';

export default {
    name: 'Register',
    inheritAttrs: false,
    components: {
        Error
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            password2: '',
            error: ''
        }
    },
    methods: {
        async handleSubmit() {
            
            try {const data = {
                username: this.username,
                email: this.email,
                password: this.password,
            }

           const response = await axios.post( 'api/register', data );
                       
           this.$router.push('/login')
        } catch (error) {
            this.error = error.response.data.msg;
        }
        }
    }
}


</script>