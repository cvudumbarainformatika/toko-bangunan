<template>
  <div class="fit column">
    <div class="full-height full-width">
      <div class="row full-height">
        <q-card flat bordered square class="col-6 full-height">
          <FormRincianPage @back="emits('back')" :data="data" :flaging="1" />
        </q-card>
        <q-card flat bordered square class="col-6 full-height">
          <!-- <ListAnamnesis :key="props.pasien" :pasien="props.pasien" :loadingaja="loadingaja" /> -->
          <ListRincianPage :data="data" />
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup>
import FormRincianPage from './FormRincianPage.vue'
import ListRincianPage from './ListRincianPage.vue'
// import { formatRpDouble } from 'src/modules/utils'

const emits = defineEmits(['back'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  flaging: {
    type: String,
    default: '',
  },
})
console.log('get', props?.data)

// const lists = computed(() => {
//   const arr = props.data?.rinci
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })
</script>
