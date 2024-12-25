<template>
  <q-input
    outlined
    :dense="dense"
    :label="label"
    hint="Name and surname"
    lazy-rules
    :rules="[ val => val && val.length > 0 || 'Please type something']"
  >
  <template
      v-if="prependIcon!==null"
      #prepend
    >
      <q-icon
        :name="prependIcon"
        size="18px"
      />
    </template>
  </q-input>
</template>

<script setup>
defineProps({
  dense: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  prependIcon: {
    type: Object,
    default: null
  }
})
</script>