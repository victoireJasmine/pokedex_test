<template>
  <q-page class="row items-center justify-evenly">
    <h1>{{ id }}</h1>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'DetailPage',
  setup() {
    const id = useRoute().params.id;
    return { id };
  },
});
</script>
