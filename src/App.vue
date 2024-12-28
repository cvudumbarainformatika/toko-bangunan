<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onBeforeMount } from 'vue';
import { useAppStore } from './stores/app';

//

const $q = useQuasar()
const app = useAppStore()

onBeforeMount(() => {
  $q.dark.set(app?.dark)
})
</script>
