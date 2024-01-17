<template>
    <div class="card">
        <h1 class="card-header">Upload some images!</h1>
        <div class="card-body">
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

export default {
    name: 'UploadWidget',
    data() {
        return {
            widget: null,
            avatar: null,
            isWidgetOpen: false
        };
    },
    methods: {
        openUploadWidget() {
            this.isWidgetOpen = true;
            this.widget.open();
        },
        removeAvatar() {
            this.avatar = null;
        },
        async handlePostUploadAction() {
            if (this.avatar) {
                console.log('Avatar URL:', this.avatar);
                console.log("after done?");

                try {
                    const data = {
                        avatar: this.avatar
                    };
                    const response = await axios.put('api/profile/avatar', data);
                    console.log(response);
                    this.$store.dispatch("user", response.data.user);
                    this.$router.push('/profile');
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    mounted() {
        this.widget = window.cloudinary.createUploadWidget(
            { cloud_name: "dwplyolgd", upload_preset: "upload_vue" },
            (error, result) => {
                if (!error && result) {
                    switch (result.event) {
                        case "success":
                            console.log('File Uploaded! Here is the image info: ', result.info);
                            this.avatar = result.info.secure_url;
                            break;
                        default:
                            console.log("close")
                            break;
                    }
                }
            }
        );
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
