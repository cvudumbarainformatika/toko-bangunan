<template>
  <q-dialog v-model="isDialogOpen" persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>CETAK DATA ORDER BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container id="printMe">
          <q-card-section class="q-pt-sm full-width">
            <!-- Tambahkan class atau style untuk memastikan gambar tampil -->
            <div class="full-width q-px-md q-py-sm">
              <div class="row full-width">
                <div class="content-center flex-center q-pr-md">
                  <img style="height: 80px" src="~assets/icon.svg" />
                </div>
                <div class="col-auto">
                  <div class="text-h6 text-left">{{ profil?.items?.namatoko }}</div>
                  <div class="text-h8 text-left">{{ profil?.items?.alamat }}</div>
                  <div class="text-h8 text-left">Telp. {{ profil?.items?.telepon }}</div>
                </div>
              </div>

              <div class="q-py-sm"><q-separator /></div>
              <div class="text-h8 q-pt-xs text-center">NOTA PEMESANAN BARANG</div>
              <div class="text-center">{{ listOrder.noorder }}</div>

              <div class="row flex-start q-pt-md items-center">
                <div class="col-2 col-md-2 text-left">Kepada</div>
                <span class="col-auto">:</span>
                <div class="col-auto q-pl-sm text-left">{{ listOrder.suplier?.nama }}</div>
              </div>
              <div class="row flex-start q-pt-xs items-center">
                <div class="col-2 col-md-2 text-left">Alamat</div>
                <span class="col-auto">:</span>
                <div class="col-auto q-pl-sm text-left">
                  {{ listOrder.suplier?.alamat }}
                </div>
              </div>
              <div class="row flex-start q-pt-xs items-center">
                <div class="col-2 col-md-2 text-left">Telepon</div>
                <span class="col-auto">:</span>
                <div class="col-auto q-pl-sm text-left">
                  {{ listOrder.suplier?.telepon }}
                </div>
              </div>
            </div>
            <table class="full-width" flat bordered wrap-cells>
              <thead>
                <tr>
                  <th class="text-center" style="width: 20px">No.</th>
                  <th class="text-center">Nama Barang</th>
                  <th class="text-center" style="width: 10%">Jumlah Barang</th>
                  <th class="text-center">Harga</th>
                  <th class="text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list, n) in listOrder?.rinci" :key="n">
                  <td class="text-right">{{ n + 1 }}.</td>
                  <td>{{ list.kdbarang }} - {{ list.mbarang?.namabarang }}</td>
                  <td>{{ list.jumlahpo }} {{ list.mbarang?.satuan_b }}</td>
                  <td class="text-right">
                    {{ formatRpDouble(list.hargapo) }}
                  </td>
                  <td class="text-right">
                    {{ formatRpDouble(list.subtotal) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-center text-bold" colspan="4">TOTAL ORDERAN</td>
                  <td class="text-right text-bold">{{ formatRpDouble(listOrder?.total) }}</td>
                </tr>
              </tbody>
            </table>
          </q-card-section>
          <q-card-section>
            <div class="row justify-between full-width">
              <div class="col-6 text-center flex-start"></div>
              <div class="col-6 text-center flex-end">
                <div>Probolinggo,</div>
                <div>{{ profil?.items?.namatoko }}</div>
                <div class="q-pt-xl"></div>
                <div>{{ profil?.items?.pemilik }}</div>
              </div>
            </div>
          </q-card-section>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="print">
                  <q-tooltip class="primary" :offset="[10, 10]"> Print </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatRpDouble } from 'src/modules/formatter'
import { useProfilStore } from 'src/stores/admin/profil'
import { onMounted, ref } from 'vue'
// import { usePrint } from 'vue3-print-nb'

const isDialogOpen = ref(false)
const listOrder = ref(null)
// Fungsi untuk membuka dialog
const openDialog = (item) => {
  console.log('itemxx', item)
  listOrder.value = item
  isDialogOpen.value = true
}

const profil = useProfilStore()

onMounted(() => {
  profil.getList()
})

// Fungsi untuk menutup dialog
// const closeDialog = () => {
//   isDialogOpen.value = false
// }

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Nota Order Barang',

  beforeOpenCallback() {
    printed.value = true
    console.log('wait...')
  },

  openCallback() {
    console.log('opened')
  },

  closeCallback() {
    printed.value = false
    console.log('closePrint')
  },
}

// const { print } = usePrint(printObj)
// Ekspos fungsi openDialog agar bisa dipanggil dari luar
defineExpose({
  openDialog,
})
</script>

<style>
/* Tambahkan border pada setiap td dan th */
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
