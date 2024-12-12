<template>
  <q-layout view="lHr lpR lFr">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!--  -->
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <!-- <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" /> -->
      </q-tabs>
    </q-header>

    <!-- left drawer -->
    <q-drawer show-if-above mini v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
       <LeftMenu />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <!-- <q-page class="fit bg-grey-3"> -->
        <router-view />
      <!-- </q-page> -->
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <div class="row justify-between items-center q-px-md q-py-sm">
        <div>Kiri</div>
        <div>Kanan</div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const LeftMenu = defineAsyncComponent(() => import('./comp/LeftMenu.vue'))


const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>