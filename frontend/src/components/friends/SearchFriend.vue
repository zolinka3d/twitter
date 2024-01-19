<template>
    <div class="search">
        <form @submit.prevent="search" class="mb-1">
            <input type="text" class="form-control" placeholder="Search for a friend" v-model="searchTerm" />
        </form>
         <div v-if="users.length > 0">
            <ul class="list-group scroll">
                <li v-for="user in users" :key="user.id" class="list-group-item">
                    <Friend :friend="user" />
                </li>
            </ul>
        </div>
    </div>


</template>


<script>
import axios from 'axios';
import Friend from './Friend.vue';


export default {
    name: 'SearchFriend',
    components: {
        Friend
    },
    data() {
        return {
            searchTerm: '',
            users: []
        }
    },
    methods: {
        async search() {
            if (this.searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/followers/search/?username=${this.searchTerm}`);
                this.users = response.data.users;
            } catch (error) {
                console.log(error);
            }
        } else {
            this.users = [];
        }
        }
        }
    }


</script>

<style>
.search {
    margin-bottom: 2em;
}

.scroll{
    height: 300px;
    overflow:scroll;
    
}

</style>