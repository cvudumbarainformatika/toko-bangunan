<template>
  <q-dialog v-model="storeform.basicpiutang" transition-show="rotate" transition-hide="rotate">
    <q-card style="width: 200vw">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          <span class="text-weight-bold text-yellow-8">
            Piutang
            <span class="text-weight-bold text-red"> {{ formatRpDouble(totalall) }}</span></span
          >
          <q-select
            v-model="storeform.kdpelanggan"
            dense
            outlined
            label="Pilih Pelanggan"
            option-label="nama"
            option-value="kodeplgn"
            :options="[{ nama: 'Semua Pelanggan', kodeplgn: null }, ...props.pelanggan]"
            @update:model-value="
              (e) => {
                caribypelanggan(e)
              }
            "
          />
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section style="max-height: 80vh" class="scroll">
        <div align="center" v-if="storeform.loadingcarinota === true">
          <q-spinner-radio color="yellow-9" size="2em" />
        </div>
        <div
          align="center"
          v-if="storeform.loadingcarinota === false && storeform.itemspiutang.length === 0"
        >
          Belum Ada Data Yang Ditampilkan...!!!
        </div>
        <div v-else>
          <q-list v-for="(item, n) in storeform.itemspiutang" :key="n" separator>
            <q-form ref="refForm" class="column full-height full-width" @submit="onSubmit(item)">
              <transition-group name="list">
                <q-item class="list-move" :key="item.no_penjualan">
                  <q-item-section class="q-pl-sm">
                    <div class="row">
                      <div class="col-5">No. Nota</div>
                      <div class="col-1">:</div>
                      <div class="col-6">{{ item?.no_penjualan }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Kirim</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">
                        {{ humanDate(item?.tgl_kirim) }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-5">Pelanggan</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.pelanggan?.nama }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Alamat</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.pelanggan?.alamat }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Sales</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.sales?.nama }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Jatuh Tempo</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-bold">
                        <span class="text-red">
                          {{ humanDate(item?.tempo) ?? '-' }} ({{
                            item?.jumlahtempo ?? 0
                          }}
                          hari)</span
                        >
                      </div>
                    </div>

                    <div class="row q-pr-sm text-weight-bold">
                      <div class="col-3 text-red text-center">
                        Total Hutang {{ formatRpDouble(item?.total) }}
                      </div>
                      <div class="col-3 text-yellow text-center">
                        Terbayar
                        {{
                          item?.cicilan?.length > 0 ? formatRpDouble(item?.cicilan[0]?.jumlah) : 0
                        }}
                      </div>
                      <div class="col-3 text-green text-center">
                        Sisa
                        {{ formatRpDouble(item?.total - item?.cicilan[0]?.jumlah) }}
                      </div>
                    </div>
                    <div
                      class="row q-pr-sm text-weight-bold"
                      v-if="storeform.form.keterangan === 'Dikembalikan'"
                    >
                      <div class="col-12 text-red">
                        <div class="row q-gutter-sm">
                          <!-- <div class="col-4">
                            <q-toggle v-model="item.bayar" label="Bayar" />
                          </div> -->
                          <div class="col-3">
                            <AppInputRp
                              label="Piutang Yang Akan Dibayar"
                              dense
                              outlined
                              v-model="item.yangakandibayar"
                              currency
                              v-if="item.bayar"
                            />
                          </div>
                          <div class="col-3">
                            <q-select
                              label="Cara Bayar"
                              dense
                              outlined
                              v-model="item.carabayarrinci"
                              :options="['Cash', 'Transfer']"
                              v-if="item.bayar"
                            />
                          </div>
                          <div class="col-4">
                            <q-input
                              label="Keterangan"
                              dense
                              outlined
                              v-model="item.keteranganrinci"
                              v-if="item.bayar"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section side>
                    <div>
                      <q-toggle v-model="item.bayar" />
                    </div>
                    <div class="q-gutter-sm">
                      <q-btn
                        :loading="
                          storeform.loadingsimpan &&
                          storeform.form.notaPenjualan === item?.no_penjualan
                        "
                        flat
                        round
                        size="lg"
                        color="lime"
                        icon="fact_check"
                        type="submit"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </q-form>
            <q-separator />
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formatRpDouble, humanDate, olahUang } from 'src/modules/utils'
import { useAdminFormTransaksiNotaSalesStore } from 'src/stores/admin/transaksi/notasales/form'
import { computed } from 'vue'

const storeform = useAdminFormTransaksiNotaSalesStore()

const props = defineProps({
  pelanggan: {
    type: Array,
    default: () => [],
  },
})

const totalall = computed(() => {
  const total = storeform.itemspiutang.reduce((a, b) => a + parseFloat(b?.total ?? 0), 0)
  return total
})

function onSubmit(item) {
  console.log('item', item)
  // storeform.form.notrans = item?.notrans
  // storeform.form.kdsales = item?.sales_id
  storeform.form.notaPenjualan = item?.no_penjualan
  storeform.form.tgljatuhtempo = item?.tempo
  storeform.form.total = olahUang(item?.total)
  storeform.form.lamatempo = item?.jml_tempo
  storeform.form.yangakandibayar = olahUang(item?.yangakandibayar)
  storeform.form.pelanggan_id = item?.pelanggan?.id
  storeform.form.cicilan = olahUang(item?.cicilan)
  storeform.form.bayar = item?.bayar
  storeform.form.terbayar = olahUang(item?.cicilan[0]?.jumlah)
  storeform.form.carabayarrinci = item?.carabayarrinci
  storeform.form.keteranganrinci = item?.keteranganrinci

  //storeform.form.terbayar = olahUang(item?.terbayar)
  // const sisahutang = olahUang(item?.sisajumlahbelumditerimax)
  // if (storeform.form.total > sisahutang) {
  //   notifError(
  //     'Jumlah Pembayaran Tidak Boleh Lebih Dari Sisa Hutang, Sisa Hutang Adalah ' +
  //       formatRpDouble(sisahutang),
  //   )
  // } else {
  storeform.simpan()
  // }
}

function caribypelanggan(val) {
  if (!val || !val.kodeplgn) {
    storeform.itemspiutang = storeform.allItemspiutang
    return
  }

  const hasil = storeform.allItemspiutang.filter((f) => f.pelanggan?.kodeplgn === val.kodeplgn)

  storeform.itemspiutang = hasil
}
</script>
