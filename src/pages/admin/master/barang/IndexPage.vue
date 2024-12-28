<template>
  <div class="fit">

    <ListPage />
    
   
    
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
</script>

<style scoped>


</style>