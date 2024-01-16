<template>
    <form class="m-2" @submit.prevent="handleSubmit">
        <h1>Register</h1>
        <div class="form-group">
            <label for="firstname">First Name</label>
            <input type="text" v-model="firstname" class="form-control" id="firstname" placeholder="Enter first name">
        </div>
        <div class="form-group">
            <label for="lastname">Last Name</label>
            <input type="text" v-model="lastname" class="form-control" id="lastname" placeholder="Enter last name">
        </div>
        <div class="form-group ">
            <label for="email">Email</label>
            <input type="text" v-model="email" class="form-control" id="email" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="text" v-model="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input type="text" v-model="password2" class="form-control" id="password2" placeholder="Confirm password">
        </div>
        <button  class="btn btn-primary" >Submit</button>
    </form>

</template>

<script>
import axios from 'axios';

export default {
    name: 'Register',
    inheritAttrs: false,
    data() {
        return {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            password2: ''
        }
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            const data = {
                firstName: this.firstname,
                lastName: this.lastname,
                email: this.email,
                password: this.password,
            }
            axios.post('http://localhost:2137/api/register', data)
            .then(
                res => {
                    console.log(res)
                }
            ).catch(err => {
                console.log(err)
            })
        }
    }
}


</script>