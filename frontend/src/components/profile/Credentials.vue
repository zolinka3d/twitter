<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <h3>Username</h3>
                <p>{{ user.username }}</p>
            </div>
        </div>
        <div class="row" v-if="user.email">
            <div class="col-md-6">
                <h3>Email</h3>
                <p>{{ user.email }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3>Avatar</h3>
                <img v-if="user.avatar" :src="user.avatar" alt="avatar" class="img"/>
                <p v-else>No avatar</p>
            </div>
        </div>
    </div>

</template>


<script>
    export default {
        name: 'Credentials',
        props: {
            user: {
                type: Object,
                required: true
            }
        }
    }

</script>


<style scoped>

.img {
    width: 100px;
    height: 100px;
    
}
</style>
