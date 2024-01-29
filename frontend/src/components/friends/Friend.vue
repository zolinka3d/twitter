<template>
    <div class="d-flex justify-content-between">
        <div class="d-flex">
            <img v-if="friend.avatar" :src="friend.avatar" alt="avatar" class="img p-2"/>
            <div class="p-2">{{ friend.username }}</div>
        </div>
        <div class="p-2 align-self-center">
            <router-link :to="{name: 'FriendProfile', params: {username: friend.username}}" class="btn btn-primary">View Profile</router-link>
        </div>
    </div>
</template>



<script>

export default {
    name: 'Friend',
    props: ['friend'],
}

</script>


<style scoped>
.img {
    width: 100px;
    height: 100px;
    
}
</style>