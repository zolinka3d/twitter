<template>
        <form @submit.prevent="send" class="d-flex ">
            <textarea class="form-control " v-model="text" placeholder="send a cookie"></textarea>
            <button class="btn btn-primary">send</button>
        </form>
</template>


<script>
import { inject } from 'vue';


export default {
    name: "Cookie",
    setup(){
        const socket = inject('socket');
        return { socket };
    },
    data(){
        return {
            text: '',
        }
    },
    created() {
        
        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('chat message', (msg) => {
            console.log('Message received:', msg);
        });

    },
    methods:{
        send(){
            console.log(this.text);
            this.socket.emit('chat message', this.text);
            this.text = '';
        }
    }
}
</script>
