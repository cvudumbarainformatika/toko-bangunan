<template>
  <q-btn class="glossy" 
      :rounded="label ? true : false" 
      :round="label ? false : true"
      no-caps
      :icon="icon"
      dense color="primary">
      <div v-if="label" class="flex items-center q-px-sm">
        <q-icon v-if="prependIcon" :name="prependIcon" size="1.5em" class="q-mr-sm" />
        <div>{{ label }}</div>
      </div>
      <template v-slot:loading>
        Loading...
      </template>
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>

defineProps({
  label: {
    type: String,
    default: null
  },
  icon: {
    type: [String, Object],
    default: null
  },
  prependIcon: {
    type: [String, Object],
    default: null
  },
  tooltip: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

</script>