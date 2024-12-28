<template>
  <q-btn class="glossy" round dense color="primary" :icon="icon" :label="label">
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>

defineProps({
  label: {
    type: String,
    default: null
  },
  icon: {
    type: [String, Object],
    default: null
  },
  tooltip: {
    type: String,
    default: null
  }
})

</script>