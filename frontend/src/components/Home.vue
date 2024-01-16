<template>
    <h1 v-if="!user">
        You are not logged in
    </h1>
    <div v-else class="container">
        <div class="row">
            <div class="col-md-6">
                <h3>First Name</h3>
                <p>{{ user.name.last }}</p>
            </div>
            <div class="col-md-6">
                <h3>Last Name</h3>
                <p>{{ user.name.first }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3>Email</h3>
                <p>{{ user.email }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Home',
        computed: {
        ...mapGetters(['user'])
        }
    }
    
</script>