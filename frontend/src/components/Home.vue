<template>
    <h1>Home</h1>
</template>

<script>
    import {mapGetters} from 'vuex';


    export default {
        name: 'Home',
        components: {
        
        },
        computed: {
        ...mapGetters(['user'])
        }
    }
    
</script>