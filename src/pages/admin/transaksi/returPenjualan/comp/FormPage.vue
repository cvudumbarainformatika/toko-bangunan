<template>
  <div class="q-pa-sm">
    <div class="row items-center">
      <div class="col-3 f-24">
        Form Retur Penjualan
      </div>
      <div class="col-9 text-right">
        <app-btn-back @click="emits('back')" />
      </div>
    </div>
  </div>
</template>
<script setup>

const emits = defineEmits(['back'])
</script>
