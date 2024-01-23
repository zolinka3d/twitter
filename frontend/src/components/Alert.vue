<template>
    <div class=" show">
      <strong>{{ username }}</strong> added a new post!
    </div>
  </template>
  
  <script>
  export default {
    name: "Alert",
    props: {
      username: {
        type: String,
        required: true
      },
    },
  };
  </script>
  