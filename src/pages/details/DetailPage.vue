<template>
  <q-page>
    <div class="q-py-lg">
      <q-btn
        label="Back"
        icon="chevron_left"
        color="primary"
        @click="$router.back()"
      />
    </div>

    <div v-if="poke">
      <div class="q-mb-lg text-center">
        <p class="text-h4">
          {{ poke.name }}
          <small class="text-primary">No. {{ poke.getNumber() }}</small>
          <span class="text-bold text-amber-7 block">
            ({{
              species?.is_baby
                ? 'Baby pokemon'
                : species?.is_legendary
                ? 'Legendary pokemon'
                : species?.is_mythical
                ? 'Mythical pokemon'
                : 'Normal pokemon'
            }})
          </span>
        </p>
      </div>

      <div class="row q-col-gutter-lg q-mt-xl">
        <div class="col-12 col-md-5">
          <div class="bg-blue-grey-1" style="border-radius: 10px">
            <q-img :src="poke.getFrontDefault()" />
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div>
            <p class="text-h6 q-mb-none">Description</p>
            <p class="">
              {{
                species?.form_descriptions[0]?.description ?? 'No description'
              }}
            </p>
          </div>
          <q-card :class="`bg-primary q-mb-lg`">
            <q-card-section>
              <div class="row q-col-gutter-md q-mb-lg text-white">
                <div class="col-6">
                  <p class="text-h6 q-mb-none">Height</p>
                  <p class="text-subtitle1 q-mb-none">
                    {{ (poke.height / 10).toFixed(1) }} m
                  </p>
                </div>

                <div class="col-6">
                  <p class="text-h6 q-mb-none">Weights</p>
                  <p class="text-subtitle1 q-mb-none">
                    {{ (poke.weight / 10).toFixed(1) }} kg
                  </p>
                </div>

                <div class="col-6">
                  <p class="text-h6 q-mb-none">Capture rate</p>
                  <p class="text-subtitle1 q-mb-none">
                    {{ species?.capture_rate }} %
                  </p>
                </div>

                <div class="col-6">
                  <p class="text-h6 q-mb-none">Base happiness</p>
                  <p class="text-subtitle1 q-mb-none">
                    {{ species?.base_happiness }} %
                  </p>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <list-chip-component :items="poke.getTypes()" title="Type" />
        </div>
      </div>

      <div class="row justify-end q-my-lg">
        <div class="col-12 col-md-7">
          <p class="text-h6">Basic stats</p>
          <div class="">
            <div
              v-for="(stat, index) in poke.stats"
              :key="index"
              class="relative-position"
            >
              <q-linear-progress
                :value="parseFloat((stat.base_stat / 255).toFixed(1))"
                size="25px"
                color="secondary"
              />
              <div class="text-white set__position">{{ stat.stat.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <q-skeleton height="50px" bordered />

      <div class="row q-col-gutter-md q-mt-xl">
        <div class="col-12 col-md-5">
          <q-skeleton height="230px" square animation="fade" />
        </div>
        <div class="col-12 col-md-7">
          <q-skeleton height="230px" square animation="fade" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Ref, ref, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { usePokemonStore } from 'src/stores/pokemons';
import { Pokemon } from 'src/normalizr/poke/pokemon';
import ListChipComponent from 'src/components/ListChipComponent.vue';
import { PokemonSpecies } from 'src/normalizr/poke/species';

export default defineComponent({
  name: 'DetailPage',
  components: {
    ListChipComponent,
  },
  setup() {
    const id = useRoute().params.id as string;
    const poke: Ref<Pokemon | null> = ref(null);
    const species: Ref<PokemonSpecies | null> = ref(null);
    return { id, poke, species };
  },
  mounted() {
    usePokemonStore()
      .getPokemonById(this.id)
      .then((pokemon) => {
        this.poke = pokemon;
      })
      .then(() => {
        usePokemonStore()
          .getSpeciciesPokemonById(this.id)
          .then((species) => {
            this.species = species;
          });
      });
  },
});
</script>

<style lang="scss" scoped>
.set__position {
  position: inherit;
  bottom: 22px;
  left: 2%;
}
</style>
