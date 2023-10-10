<script setup>
import LayoutNar from './components/LayoutNar.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutFooter from './components/LayoutFooter.vue';

</script>

<template>
  <LayoutNar />
  <LayoutHeader />
  <!-- 添加key 破坏复用机制 强制销毁重建-->
  <!-- <RouterView :key="$route.fullPath" /> -->
  <RouterView />
  <LayoutFooter />
</template>

<style scoped>

</style>
