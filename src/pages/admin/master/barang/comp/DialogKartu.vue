<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>KARTU STOK BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="row q-gutter-sm q-px-md q-py-md">
              <app-select
                v-model="store.params.bulan"
                class="col-3"
                label="Pilih Bulan"
                outlined
                :options="store.pilihbulan"
                option-label="label"
                option-value="value"
              />
              <app-input v-model="store.params.tahun" class="col-3" label="Tahun" outlined />
              <app-btn
                class="bg-yellow-8 text-black"
                label="Ambil Data"
                :loading="store.loading"
                @click="ambilData()"
              />
            </div>
          </q-card-section>
        </q-header>
        <q-page-container>
          <div id="printMe">
            <div class="row full-width justify-center q-pa-sm">
              <kop-cetak />
              <table class="full-width">
                <thead>
                  <tr>
                    <th class="text-center">No</th>
                    <th class="text-center">Tanggal</th>
                    <th class="text-center">Transaksi</th>
                    <th class="text-center">Penerimaan</th>
                    <th class="text-center">Pengeluaran</th>
                    <th class="text-center">Total Stok</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, n) in store.kartuStok?.kartustok" :key="n">
                    <td class="text-center">{{ n + 1 }}</td>
                    <td class="text-center">{{ humanDate(item?.tanggal) }}</td>
                    <td>{{ item.notransaksi }}</td>
                    <td>
                      {{ item.debit }} {{ item.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ item.debit_b }} {{ item.satuan_b }})</span
                      >
                    </td>
                    <td>
                      {{ item.kredit }} {{ item.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ item.kredit_b }} {{ item.satuan_b }})
                      </span>
                    </td>
                    <td class="content-center">
                      {{ item.total }} {{ item.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ item.total_b }} {{ item.satuan_b }})
                      </span>
                    </td>
                  </tr>
                  <tr class="text-bold">
                    <td class="text-right" colspan="3">Jumlah Stok</td>
                    <td>
                      {{ store.kartuStok?.total?.total_debit }} {{ store.kartuStok?.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ store.kartuStok?.total?.total_debitbesar }}
                        {{ store.kartuStok?.satuan_b }})
                      </span>
                    </td>
                    <td>
                      {{ store.kartuStok?.total?.total_kredit }} {{ store.kartuStok?.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ store.kartuStok?.total?.total_kreditbesar }}
                        {{ store.kartuStok?.satuan_b }})
                      </span>
                    </td>
                    <td>
                      {{ store.kartuStok?.total?.saldo_akhir }} {{ store.kartuStok?.satuan_k }}
                      <span class="text-yellow-8" style="font-size: x-small">
                        ({{ store.kartuStok?.total?.saldo_akhirbesar }}
                        {{ store.kartuStok?.satuan_b }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list'
import { useProfilStore } from 'src/stores/admin/profil'
import { ref } from 'vue'
import KopCetak from './KopCetak.vue'
import { humanDate } from 'src/modules/utils'
// import { usePrint } from 'vue3-print-nb'

const profil = useProfilStore()
const store = useAdminMasterBarangStore()

// onMounted(async () => {
//   if (!profil.profilData) {
//     await profil.getProfil()
//   }
// })

function ambilData() {
  store.getList()
  // {
  //   store.kartuStok = store.meta
  // }
  console.log('items', store.kartuStok)
}

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Printed from ' + profil.profilData?.namatoko + ' app',

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
</script>

<style>
/* Tambahkan border pada setiap td dan th */
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5px;
}
</style>
