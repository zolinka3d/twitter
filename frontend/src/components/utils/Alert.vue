<template>
    <div class="show">
      <strong>{{ message }}</strong> 
    </div>
  </template>
  
  <script>
  export default {
    name: "Alert",
    props: {
      message: {
        type: String,
        required: true
      },
    },
  };
  </script>
  