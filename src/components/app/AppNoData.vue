<template>
  <div
    class="flex column flex-center bg-loading-bg__table"
    style="height:300px"
  >
    <div>
      <q-icon
        name="receipt_long"
        color="primary"
        size="60px"
      />
    </div>
    <div class="text-primary q-mt-sm">
      {{ text }}
    </div>
  </div>
</template>
<script setup>

defineProps({
  text: {
    type: String,
    default: 'Tidak Ada Data'
  }
})
</script>
