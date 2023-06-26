<template>
  <q-page>
    <div class="q-py-lg">
      <p class="text-center text-h4 text-bold text-amber-6 text-italic">
        Pokedex project
      </p>
    </div>

    <div class="q-mb-lg">
      <q-card class="banner" flat>
        <q-card-section horizontal class="full-height">
          <q-img
            class="col full-height"
            src="https://i0.wp.com/pokecards.fr/wp-content/uploads/2021/12/logopokvisuel.png?w=980&ssl=1"
          />
        </q-card-section>
      </q-card>
    </div>

    <div>
      <div>
        <q-expansion-item
          :disable="!dataIsReady"
          class="overflow-hidden col"
          icon="filter_alt"
          label="Filter results for the current page"
        >
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="visiblePokemonTypes"
                    multiple
                    :options="
                      pokemonTypes.map((type) => ({ label: type, value: type }))
                    "
                    use-chips
                    stack-label
                    label-slot
                    class="q-ma-md"
                  >
                    <template #label> Type of pokemon </template>
                    <template #selected-item="scope">
                      <q-chip
                        removable
                        dense
                        :tabindex="scope.tabindex"
                        color="white"
                        text-color="primary"
                        class="q-ma-none"
                        @remove="scope.removeAtIndex(scope.index)"
                      >
                        {{ scope.opt.label }}
                      </q-chip>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-6">
                  <p class="text-weight-bold">Size scale</p>
                  <div class="row q-col-gutter-md">
                    <div
                      v-for="(value, key) in heightScale"
                      :key="key"
                      class="col-4 cursor-pointer"
                    >
                      <q-card
                        :class="
                          visiblePokemonHeight.includes(value)
                            ? 'bg-primary text-white'
                            : ''
                        "
                        @click="updateFilterScale(value)"
                      >
                        <q-card-section>
                          {{ value }}
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <div class="flex justify-end items-center">
        <q-input
          :disable="!dataIsReady"
          color="grey-3"
          label-color="primary"
          v-model="searchText"
          label="Search by Name"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-py-lg q-mt-lg q-mb-xl">
      <div v-if="dataIsReady" class="row q-col-gutter-md">
        <div
          v-for="(poke, index) in displayPokemons"
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <card-component
            :img="poke.detail?.().getFrontDefault()"
            :title="poke.name"
            :class-name="'cursor-pointer q-hoverable'"
            @click="goToDetail(poke.name)"
          >
            <template #before-title>
              <div class="text-subtitle2">
                No. {{ poke.detail?.().getNumber() }}
              </div>
            </template>
            <template #footer>
              <q-chip
                v-for="(type, indexType) in poke.detail?.().getTypes()"
                :key="indexType"
                :style="`background-color: ${Factory.colorByString(type)}`"
                text-color="white"
                square
              >
                {{ type }}
              </q-chip>
            </template>
          </card-component>
        </div>

        <div v-if="!displayPokemons?.length">
          <div class="text-h5 text-center text-italic text-weight-bold">
            No results found
          </div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-md">
        <q-card v-for="n in 12" :key="n" flat class="col-12 col-md-4 col-lg-3">
          <q-skeleton height="150px" square />

          <q-card-section>
            <q-skeleton type="text" width="50%" class="text-subtitle1" />
            <q-skeleton type="text" class="text-caption" />
          </q-card-section>
        </q-card>
      </div>

      <div
        v-if="dataIsReady"
        class="q-mt-xl flex justify-end items-center q-gutter-md"
      >
        <q-btn
          v-if="previousPage"
          label="Previous page"
          color="amber-6"
          icon="arrow_back_ios"
          @click="getPokemons('previous')"
        />
        <q-btn
          v-if="nextPage"
          label="Next page"
          color="amber-6"
          icon-right="arrow_forward_ios"
          @click="getPokemons('next')"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { usePokemonStore } from 'src/stores/pokemons';
import { storeToRefs } from 'pinia';
import { ResultPoke } from 'src/normalizr/poke/result';
import { heightScale } from 'src/shared/constant';

import CardComponent from 'src/components/CardComponent.vue';
import { Factory } from 'src/modules/Utils';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CardComponent,
  },
  setup() {
    const {
      pokemons,
      previous: previousPage,
      current: currentPage,
      next: nextPage,
    } = storeToRefs(usePokemonStore());
    const searchText: Ref<string> = ref('');
    const displayPokemons: Ref<ResultPoke[] | null> = ref(null);
    const pokemonTypes: Ref<string[]> = ref([]);
    const visiblePokemonTypes: Ref<{ value: string; label: string }[]> = ref(
      []
    );
    const visiblePokemonHeight: Ref<string[]> = ref([]);
    return {
      searchText,
      pokemons,
      displayPokemons,
      pokemonTypes,
      visiblePokemonTypes,
      heightScale,
      visiblePokemonHeight,
      Factory,
      previousPage,
      nextPage,
      currentPage,
    };
  },
  computed: {
    dataIsReady() {
      return this.pokemons !== null;
    },
  },
  watch: {
    pokemons() {
      this.displayPokemons = this.pokemons;
      if (this.pokemons) {
        const types: string[] = [];
        this.pokemons.map((pokemon) => {
          if (pokemon.detail) {
            types.push(...pokemon.detail().getTypes());
          }
        });
        this.pokemonTypes = [...new Set(types)];
      }
    },
    searchText() {
      this.onSearch();
    },
    visiblePokemonTypes() {
      const typesToDisplay = this.visiblePokemonTypes.map((type) => type.value);
      this.onFilterTypes(typesToDisplay);
    },
    visiblePokemonHeight() {
      this.onFilterHeight(this.visiblePokemonHeight);
    },
  },
  mounted() {
    this.getPokemons('current');
  },
  methods: {
    getPokemons(direction?: 'next' | 'previous' | 'current'): void {
      this.visiblePokemonTypes = [];
      this.visiblePokemonHeight = [];
      this.searchText = '';

      usePokemonStore().load(direction);
    },
    onSearch(): void {
      if (!this.pokemons) {
        this.displayPokemons = null;
        return;
      }
      this.displayPokemons = [
        ...this.pokemons.filter(
          (pokemon) => pokemon.name.indexOf(this.searchText) !== -1
        ),
      ];
    },
    onFilterTypes(visibleTypes: string[]): void {
      if (!this.pokemons) {
        this.displayPokemons = null;
        return;
      }

      if (!visibleTypes.length) {
        this.displayPokemons = this.pokemons;
        return;
      }

      this.displayPokemons = [
        ...this.pokemons.filter((pokemon) => {
          if (!pokemon.detail) {
            return false;
          }
          const checkTypes = pokemon
            .detail()
            .getTypes()
            .filter((type) => visibleTypes.includes(type));
          return checkTypes.length ? true : false;
        }),
      ];
    },
    updateFilterScale(value: string): void {
      const clone = [...this.visiblePokemonHeight];
      const checkIndex = clone.findIndex((val) => val === value);
      if (checkIndex === -1) {
        clone.push(value);
      } else {
        clone.splice(checkIndex, 1);
      }
      this.visiblePokemonHeight = clone;
    },
    onFilterHeight(scales: string[]): void {
      console.log(scales);
      if (!this.pokemons) {
        this.displayPokemons = null;
        return;
      }

      if (!scales.length) {
        this.displayPokemons = this.pokemons;
        return;
      }

      this.displayPokemons = [
        ...this.pokemons.filter((pokemon) => {
          if (!pokemon.detail) {
            return false;
          }
          return scales.includes(pokemon.detail().getHeightScale());
        }),
      ];
    },
    goToDetail(name: string): void {
      this.$router.push(`/detail/${name}`);
    },
  },
});
</script>
<style lang="scss">
.banner {
  height: 13rem;
}
</style>
