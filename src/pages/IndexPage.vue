<template>
  <q-page>
    <div class="q-py-lg">
      <p class="text-center text-h4 text-bold text-amber-6 text-italic">
        Pokedex projet
      </p>
    </div>
    <div class="q-mb-lg">
      <q-card class="my-card" flat>
        <q-card-section horizontal class="full-height">
          <q-img
            class="col full-height"
            src="https://cdn.quasar.dev/img/mountains.jpg"
          />
        </q-card-section>
      </q-card>
    </div>
    <div>
      <div class="flex justify-between items-center">
        <q-icon name="filter_alt" size="md" color="amber-6" />
        <q-input
          color="grey-3"
          label-color="primary"
          v-model="searchText"
          label="Rechercher par Nom"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-py-lg">
      <div v-if="pokemons" class="row q-col-gutter-md">
        <q-card
          v-for="(poke, index) in pokemons"
          :key="index"
          class="animating pokemon-card col-md-4 col-lg-3 col-12"
        >
          <q-img :src="poke.detail?.().sprites.front_default" />

          <q-card-section>
            <div class="text-subtitle2">Number</div>
            <div class="text-h6">{{ poke.name }}</div>
          </q-card-section>

          <div class="flex direction-row justify-around items-center">
            <q-btn
              style="background: goldenrod; color: white"
              label="Goldenrod"
            />
            <q-btn outline style="color: goldenrod" label="Goldenrod" />
          </div>

          <q-card-section class="q-pt-none">gi </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { usePokemonStore } from 'src/stores/pokemons';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { pokemons } = storeToRefs(usePokemonStore());
    const searchText: Ref<string | null> = ref(null);
    return { searchText, pokemons };
  },
  mounted() {
    this.getPokemons();
  },
  methods: {
    getPokemons(): void {
      usePokemonStore().load();
    },
  },
});
</script>
<style lang="scss">
.my-card {
  height: 13rem;
}
.q-card.animating.pokemon-card {
  width: 25%;
}
</style>
