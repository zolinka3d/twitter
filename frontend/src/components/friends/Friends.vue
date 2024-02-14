<template>
    <div class="container" v-if="friends">
        <SearchFriend />
        <div class="row">
            <div class="col-md-6">
                <h3>Followers</h3>
                <ul class="list-group">
                    <li class="list-group-item" v-for="follower in friends.followers" :key="follower.id">
                        <Friend :friend="follower" /> 
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h3>Following</h3>
                <ul class="list-group">
                    <li class="list-group-item" v-for="following in friends.following" :key="following.id">
                        <Friend :friend="following" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-else>
        <h3>Please log in</h3>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Friend from './Friend.vue';
    import SearchFriend from './SearchFriend.vue';

    export default {
        name: 'Friends',
        components:{
            Friend,
            SearchFriend
        },
        computed: {
        ...mapGetters(['friends'])
        },
        
    }

</script>