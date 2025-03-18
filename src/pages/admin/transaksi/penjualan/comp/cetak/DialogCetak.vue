<template>
  <q-dialog presistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 60vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header>
          <q-bar class="bg-primary text-white">
            <div>Cetak Nota</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div class="q-pa-sm">
            <!-- <data-cetak :imgKey="imgKey" /> -->
            <q-card-section class="q-pt-sm full-width">
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
                <div class="col q-pt-sm text-bold text-center">NOTA PENJUALAN</div>
                <div class="col text-center">
                  {{ store.item?.no_penjualan }}
                </div>
                <div class="row flex-start q-pt-md items-center">
                  <div class="col-2 col-md-2 text-left">Kepada</div>
                  <span class="col-auto">:</span>
                  <div class="col-auto q-pl-sm text-left">{{ store.item?.pelanggan }}</div>
                </div>
                <div class="row flex-start q-pt-xs items-center">
                  <div class="col-2 col-md-2 text-left">Alamat</div>
                  <span class="col-auto">:</span>
                  <div class="col-auto q-pl-sm text-left">
                    {{ store.item?.tgl ? store.item.tgl.split(' ')[0] : '' }}
                  </div>
                </div>
                <div class="row flex-start q-pt-xs items-center">
                  <div class="col-2 col-md-2 text-left">Telepon</div>
                  <span class="col-auto">:</span>
                  <div class="col-auto q-pl-sm text-left">
                    {{ store.item?.telepon }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-page-container>
        <q-footer>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <app-btn-cetak unelevated> </app-btn-cetak>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useProfilStore } from 'src/stores/admin/profil'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'

const store = useFromPenjualanStore()
const profil = useProfilStore()
</script>
