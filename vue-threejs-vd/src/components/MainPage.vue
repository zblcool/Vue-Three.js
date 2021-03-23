<template>
  <!-- <h1>Hello, world!</h1> -->
  <body>
    <div class="container">
      <!-- <nav>
          hi
      </nav> -->
      <three-interface>
      </three-interface>
    </div>
  </body>
</template>

<script>
import ThreeInterface from './ThreeInterface.vue';
export default {
  name: 'MainPage',
  components: {
      ThreeInterface
  },
};
</script>

<style>

.navbar {
background: #ff7b30;
margin-bottom: -21px !important;
height: 80px;
line-height: 80px;
font-size: 24px;
color: white;
padding-left: 38px;
}

</style>
