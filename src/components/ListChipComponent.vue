<template>
  <div>
    <p class="text-h6 q-mb-sm">{{ title }}</p>
    <q-chip
      v-for="(item, i) in items"
      :key="i"
      :style="`background-color: ${Factory.colorByString(item)}`"
      text-color="white"
      square
    >
      {{ item }}
    </q-chip>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Factory } from 'src/modules/Utils';

export default defineComponent({
  name: 'CardComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Object as PropType<string[]>,
      required: true,
    },
  },
  setup() {
    return {
      Factory,
    };
  },
});
</script>
