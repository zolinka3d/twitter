<template>
    
    <div>
        <div class="header">
            <div class="user">
                <div class="user">
                    <img :src="post.user.avatar" alt="profile img"  class="img"/>
                </div>
                <div class="user">
                    <h3>{{ post.user.username }}</h3>
                </div>
            </div>
            <div class="date">
                <p class="day">{{ post.date.split('T')[0] }}</p>
                <p class="hour">{{ post.date.split('T')[1].split('.')[0] }}</p>
            </div>
        </div>
        <div class="content">
            <div class="text-body">{{ post.text }}</div>
        </div>
        <div class="footer">
            <div class="comments">
                <CoCommentBubble />
                <span>{{ post.comments.length }}</span>
            </div>
        </div>
    </div>

</template>

<script>
import { CoCommentBubble } from "oh-vue-icons/icons";
export default {
  name: "Post",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};

</script>

<style scoped>

.header {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    margin-bottom: 1rem;

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

</style>