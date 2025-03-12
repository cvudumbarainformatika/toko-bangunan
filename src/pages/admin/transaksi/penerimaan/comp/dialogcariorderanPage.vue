<template>
  <q-dialog v-model="storeorder.fixed">
    <q-card>
      <q-card-section>
        <div class="text-h6"><q-input outlined label="Cari Orderan" clearable /></div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-list separator>
          <transition-group name="list">
            <q-item v-for="(item, n) in storeorder.itemorderan" :key="n" class="list-move">
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-bold">No. Order</span> :
                  <span class="text-weight-bold"
                    ><q-badge outline color="red">{{ item?.noorder }}</q-badge></span
                  >
                </q-item-label>
                <!-- <q-separator class="q-my-md" /> -->
                <q-item-label>
                  <span class="text-weight-bold">Tgl</span> :
                  <span class="text-weight-bold">{{ item?.tglorder }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-bold">Supplier</span> :
                  <span class="text-weight-bold"
                    ><q-badge color="green">{{ item?.suplier?.nama }}</q-badge></span
                  >
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-bold">Total</span> :
                  <span class="text-weight-bold"
                    ><q-badge>{{ formatRpDouble(item?.total) }}</q-badge></span
                  >
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="q-gutter-sm" v-if="item?.flaging === '1'">
                  <q-btn
                    flat
                    round
                    size="lg"
                    color="primary"
                    icon="fact_check"
                    @click="pilih(item)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <!-- <q-btn flat label="Decline" color="primary" v-close-popup /> -->
        <q-btn label="Keluar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formatRpDouble } from 'src/modules/formatter'
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'

const storeorder = useAdminListTransaksiOrderBarangStore()
const storepenerimaan = useAdminFormTransaksiPenerimaanBarangStore()

function pilih(item) {
  // console.log('item', item)
  // storepenerimaan.form.id = item?.id
  storepenerimaan.form.noorder = item?.noorder
  storepenerimaan.form.suplier = item?.suplier?.nama
  storepenerimaan.form.kdsuplier = item?.kdsuplier
  storepenerimaan.rinci = item?.rinci
}
</script>
