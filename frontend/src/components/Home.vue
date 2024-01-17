<template>
    
    <UploadWidget />
</template>

<script>
    import {mapGetters} from 'vuex';
    import UploadWidget from './UploadWidget.vue';

    export default {
        name: 'Home',
        components: {
            UploadWidget
        },
        computed: {
        ...mapGetters(['user'])
        }
    }
    
</script>