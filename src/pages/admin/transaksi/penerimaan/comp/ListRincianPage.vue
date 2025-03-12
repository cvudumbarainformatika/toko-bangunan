<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <!-- <q-avatar size="33px" color="dark" text-color="white">-</q-avatar> -->
        <q-form ref="refForm" class="column full-height">
          <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
            <div class="row items-center justify-between">
              <div class="f-12 text-weight-bold" style="height: 23px">
                <span> Data Order || No.Order : 00000</span>
              </div>
            </div>
          </q-card-section>
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="row q-gutter-sm">
              <div class="col-6">
                <app-input label="No. Orderan" />
              </div>
              <div class="col-5">
                <app-input label="No. Orderan" />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
// import { useQuasar } from 'quasar'
// import { formatRpDouble } from 'src/modules/formatter'
// import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
// import { computed } from 'vue'

// const $q = useQuasar()
// const storeform = useAdminFormTransaksiOrderBarangStore()
// const props = defineProps({
//   data: {
//     type: Object,
//     default: null,
//   },
// })

// function hapusrincian(id, noorder) {
//   $q.dialog({
//     dark: true,
//     title: 'Peringatan',
//     message: 'Apakah Data ini akan dihapus?',
//     cancel: true,
//     persistent: true,
//   })
//     .onOk(() => {
//       // console.log('OK')
//       storeform.deleteData(id, noorder)
//     })
//     .onCancel(() => {
//       // console.log('Cancel')
//     })
//     .onDismiss(() => {
//       // console.log('I am triggered on both OK and Cancel')
//     })
// }

// const lists = computed(() => {
//   const arr = props.data?.rinci
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })
</script>
