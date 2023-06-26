<template>
  <q-card class="bg-blue-grey-1" :class="className">
    <q-img :src="img" :ratio="16 / 9" fit="contain" />

    <q-card-section class="text-center">
      <slot name="before-title" />
      <div class="text-h6">{{ title }}</div>
      <slot name="after-title" />
    </q-card-section>
    <q-card-section class="flex justify-around items-center">
      <slot name="footer" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    ratioImg: {
      type: Number,
      default: 4 / 3,
    },
  },
});
</script>
