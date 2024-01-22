<template>
    
    <div class="post">
        <div class="header" >
            <router-link :to="{name: 'FriendProfile', params: {username: post.user.username}}" class="user">
                <div class="user">
                    <img :src="post.user.avatar" alt="profile img"  class="img"/>
                </div>
                <div class="user">
                    <h3>{{ post.user.username }}</h3>
                </div>
            </router-link>
            <div class="date">
                <p class="day">{{ post.date.split('T')[0] }}</p>
                <p class="hour">{{ post.date.split('T')[1].split('.')[0] }}</p>
            </div>
        </div>
        <div >
            <div class="content">
                <router-link :to="{name: 'PostWithReference', params: {id: post.id}}">
                    <h4 class="text-body">{{ post.text }}</h4>
                    <div v-if="post.reference">
                        <p>is a reference to: {{ post.reference.text }}</p>
                    </div>
                </router-link>
                
                <div v-if="post.quote" class="post list-group-item mb-1">
                    <div class="header" >
                        <router-link :to="{name: 'FriendProfile', params: {username: post.quote.user.username}}" class="user">
                            <div class="user">
                                <img :src="post.quote.user.avatar" alt="profile img"  class="img"/>
                            </div>
                            <div class="user">
                                <h3>{{ post.quote.user.username }}</h3>
                            </div>
                        </router-link>
                        <div class="date">
                            <p class="day">{{ post.quote.date.split('T')[0] }}</p>
                            <p class="hour">{{ post.quote.date.split('T')[1].split('.')[0] }}</p>
                        </div>
                    </div>
                    <router-link :to="{name: 'PostWithReference', params: {id: post.quote.id}}" class="content">
                        <h4 class="text-body">{{ post.quote.text }}</h4>
                    </router-link>
                </div>
            </div>
            <div class="footer">
                <router-link :to="{name: 'PostWithReference', params: {id: post.id}}" class="comments">
                    <font-awesome-icon icon="comment" />
                    <span>{{ post.comments.length }}</span>
                </router-link>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  name: "Post",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
    components: {
    },
};

</script>

<style scoped>

.post {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.header {
    display: flex;
    justify-content: space-between;
}
.user {
    display: flex;
    align-items: center;
}

.img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 1rem;
}

.date {
    display: flex;
    gap: 1rem;
    .day {
        font-weight: bold;
    }
}

.comments {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
}

</style>