<template>
  <div class="fit">

    <ListPage v-if="!isForm" @add="isForm = true" />
    
    <FormPage v-else @back="isForm = false" />
    
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isForm = ref(true)
</script>

<style scoped>


</style>