<template>
    <div class="card">
        <h1 class="card-header">Upload some images!</h1>
        <div class="card-body">
            <Error v-if="error" :error="error"/>
            <div class="list-group avatar-container">
                <button @click="openUploadWidget" class="btn btn-primary">Upload a new photo</button>
            </div>
            <div class="list-group avatar-container" v-if="avatar">
                <img :src="avatar" alt="avatar" class="img" />
                <button @click="removeAvatar" class="btn btn-primary">Remove</button>
                <button @click="handlePostUploadAction" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Error from '../utils/Error.vue'

export default {
    name: 'UploadWidget',
    data() {
        return {
            widget: null,
            avatar: null,
            isWidgetOpen: false,
            error: null
        };
    },
    components:{
        Error
    },
    methods: {
        openUploadWidget() {
            this.isWidgetOpen = true;
            if (this.widget)
            {
                this.widget.open();
            }
            
        },
        removeAvatar() {
            this.avatar = null;
        },
        async handlePostUploadAction() {
            if (this.avatar) {
                // console.log('Avatar URL:', this.avatar);
                // console.log("after done?");

                try {
                    const data = {
                        avatar: this.avatar
                    };
                    const response = await axios.put('api/profile/avatar', data);
                    const posts = this.$store.state.user.posts
                    this.$store.dispatch("user", {
                    username: response.data.user.username,
                    email: response.data.user.email,
                    avatar: response.data.user.avatar,
                    posts: posts
                });
                    this.error = null;
                    this.$router.push('/profile');
                } catch (error) {
                    this.error = "Check your network connection"
                    console.log(error);
                }
            }
        }
    },
    mounted() {
        try {
            this.widget = window.cloudinary.createUploadWidget(
            { cloud_name: "dwplyolgd", upload_preset: "upload_vue" },
            (error, result) => {
                if (!error && result) {
                    this.error = null;
                    switch (result.event) {
                        case "success":
                            // console.log('File Uploaded! Here is the image info: ', result.info);
                            this.avatar = result.info.secure_url;
                            break;
                        default:
                            
                            break;
                    }
                } else {
                    this.error = "Check your network connection"
                }
            }
        );
        } catch (error) {
            console.log(error);
        }
        
    }
}
</script>

<style>
.avatar-container {
    width: 300px;
}

.img {
    height: 300px;
    object-fit: cover;
}
</style>
