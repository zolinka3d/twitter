<template>

    <!-- simple form for username, password and button submit -->
    
    <form class="m-2">
        <h1>Login</h1>
        <div class="form-group ">
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="text" v-model="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>


<script>
    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: ''
            }
        }
    }

</script>