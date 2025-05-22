<template>
  <div class="q-pa-sm">
    <div class="row items-center">
      <div class="col-3 f-24">Form Retur Penjualan</div>
      <div class="col-9 text-right">
        <app-btn-back @click="emits('back')" />
      </div>
    </div>

    <q-separator />
    <div v-if="store.item?.detail?.length">
      <div class="text-center q-my-sm f-16">Nomor Penjualan : {{ store.item?.no_penjualan }}</div>
      <div v-if="store.noRetur" class="text-center q-my-sm f-16">
        Nomor Retur Penjualan : {{ store.noRetur }}
      </div>
      <div class="row items-center q-pa-sm q-col-gutter-sm">
        <div class="col-4">Nama Barang</div>
        <div class="col-1">Satuan</div>
        <div class="col-2">Jumlah</div>
        <div class="col-2">Retur</div>
        <div class="col-1 text-center">Max Retur</div>
        <div class="col-2 text-center">#</div>
      </div>
      <q-separator />
      <div v-for="(item, index) in store.item?.detail" :key="index">
        <div class="row items-center q-pa-sm q-col-gutter-sm">
          <div class="col-4">{{ item?.master_barang?.namabarang }}</div>
          <div class="col-1">{{ item?.master_barang?.satuan_k }}</div>
          <div class="col-2">{{ item?.jumlah }}</div>
          <div class="col-2">
            <app-input
              v-model="item.retur"
              label="Jumlah retur"
              @clear="
                () => {
                  item.retur = 0
                }
              "
              @update:model-value="
                (val) => {
                  const _removedZeros = isNaN(parseInt(val)) ? 0 : parseInt(val)
                  const sudahRetur = store.item?.detail_retur
                    .filter((f) => f.kodebarang === item.kodebarang && f.status !== '')
                    ?.reduce((acc, cur) => acc + cur.jumlah, 0)
                  if (_removedZeros <= item.sisa) {
                    item.retur = _removedZeros
                    item.sisa = item.jumlah - _removedZeros - sudahRetur
                  } else {
                    item.retur = item.jumlah - sudahRetur
                    item.sisa = 0
                    notifError('Jumlah retur tidak boleh lebih dari Max Retur')
                  }
                }
              "
              :disable="item?.loading"
              :loading="item?.loading"
            />
          </div>
          <div class="col-1 text-center">{{ item?.sisa }}</div>
          <div class="col-2 text-center">
            <app-btn
              icon="send"
              color="grey-10"
              dense
              @click="
                () => {
                  submit(item)
                }
              "
              :disable="item?.loading"
              :loading="item?.loading"
            >
              <q-tooltip>simpan</q-tooltip>
            </app-btn>
          </div>
        </div>
        <q-separator :class="{ 'q-mb-md': index === store.item?.detail?.length - 1 }" />
      </div>
      <div v-if="store.noRetur" class="row justify-end q-mr-sm">
        <div class="col-2">
          <app-btn
            label="Selesai dan kurangi stok"
            color="primary"
            @click="
              () => {
                selesai()
              }
            "
            :disable="store.loading"
            :loading="store.loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { notifError } from 'src/modules/notifs'
import { useFormReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/form'

const emits = defineEmits(['back', 'selesai'])
const store = useFormReturPenjualanStore()
function submit(item) {
  if (parseInt(item.retur) === 0) return notifError('Jumlah retur tidak boleh nol')
  store.initForm('no_penjualan', item?.no_penjualan)
  store.initForm('kodebarang', item?.kodebarang)
  store.initForm('retur', item?.retur)
  store.initForm('harga_jual', item?.harga_jual)
  store.initForm('id', item?.id)
  store.submit(item)
  console.log('item', store.form, item)
}
function selesai() {
  store.loading = true
  store
    .selesai({ no_retur: store.noRetur })
    .then((data) => {
      store.loading = false
      emits('selesai', data)
    })
    .catch(() => {
      store.loading = false
      // console.log('err', err);
    })
    .finally(() => {
      store.loading = false
    })
}
</script>
