<script setup>
  import HomeProduct from './components/HomeProduct.vue'
  import HomeHot from './components/HomeHot.vue'
  import HomeNew from './components/HomeNew.vue'
  import HomeBanner from './components/HomeBanner.vue'
  import HomeCategory from './components/HomeCategory.vue'
</script>

<template>
  <div class="container">
    <HomeCategory/>
    <HomeBanner/>
  </div>
  <HomeNew/>
  <HomeHot/>
  <HomeProduct/>
  <el-backtop :right="100" :bottom="100" />
</template>
