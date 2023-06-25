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
      <div>
        <q-expansion-item
          :disable="pokemons===null"
          class="overflow-hidden col"
          icon="filter_alt"
          label="Filtrer les resultats"
        >
          <q-card>
            <q-card-section>
              <div class="row">
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
                    <template #label> Type de pokémon </template>
                    <template #selected-item="scope">
                      <q-chip
                        removable
                        dense
                        :tabindex="scope.tabindex"
                        color="white"
                        class="q-ma-none"
                        @remove="scope.removeAtIndex(scope.index)"
                      >
                        {{ scope.opt.label }}
                      </q-chip>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-6">
                  <div class="row">
                    
                    <q-card
                      v-for="(value, key) in heightScale"
                      :key="key"
                      class="col-4 cursor-pointer"
                      :class="visiblePokemonHeight.includes(value)? 'bg-primary text-white':'' "
                      @click="updateFilterScale(value)"
                       
                    >
                      <q-card-section>
                        {{ value }}
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <div class="flex justify-end items-center">
        <q-input
          :disable="pokemons===null"
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
    <div class="q-py-lg q-mt-lg">
      <div v-if="pokemons===null" class="row">
            <q-card v-for="n in 12" :key="n" flat class="col-12 col-md-4 col-lg-3">
          <q-skeleton height="150px" square />

          <q-card-section>
            <q-skeleton type="text" width="50%" class="text-subtitle1" />
            <q-skeleton type="text" class="text-caption" />
          </q-card-section>
        </q-card>
      </div>
      <div v-else class="row q-col-gutter-md">
        <q-card
          v-for="(poke, index) in displayPokemons"
          :key="index"
          class="animating pokemon-card col-md-4 col-lg-3 col-12"
        >
          <q-img :src="poke.detail?.().sprites.front_default" />

          <q-card-section>
            <div class="text-subtitle2">
              N° {{ poke.detail?.().getNumber() }}
            </div>
            <div class="text-h6">{{ poke.name }}</div>
          </q-card-section>

          <div class="flex direction-row justify-around items-center">
            <q-btn
              v-for="(type, indexType) in poke.detail?.().getTypes()"
              :key="indexType"
              color="amber-6"
              text-color="white"
              :label="type"
            />
          </div>

          <q-card-section class="q-pt-none"></q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { usePokemonStore } from 'src/stores/pokemons';
import { storeToRefs } from 'pinia';
import { ResultPoke } from 'src/normalizr/poke/pokemon';
import { heightScale } from 'src/shared/constant';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { pokemons } = storeToRefs(usePokemonStore());
    const searchText: Ref<string> = ref('');
    const displayPokemons: Ref<ResultPoke[] | null> = ref(null);
    const pokemonTypes: Ref<string[]> = ref([]);
    const visiblePokemonTypes: Ref<{ value: string; label: string }[]> = ref(
      []
    );
    const visiblePokemonHeight: Ref<string[]> = ref([]);
    const pages: Ref<number[]> = ref([]);
    return {
      searchText,
      pokemons,
      displayPokemons,
      pokemonTypes,
      visiblePokemonTypes,
      heightScale,
      visiblePokemonHeight,
      pages,
      page:ref(1),
    };
  },
  computed:{
    dataIsReady(){
      this.pokemons !== null
    },
    displayedPokemons(){
      let page = this.page;
            let perPage = 25;
            let from = (page * perPage) - perPage;
            let to = (page * perPage);
            return  this.pokemons?.slice(from, to)??[];
    }
  },
  watch: {
    pokemons() {
      this.displayPokemons = this.pokemons;
      this.setPages()
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
    visiblePokemonHeight(){
      this.onFilterHeight(this.visiblePokemonHeight);

    }
  },
  mounted() {
    this.getPokemons();
  },
  methods: {
    getPokemons(): void {
      usePokemonStore().load();
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
    updateFilterScale(value: string): void{
      const clone = [...this.visiblePokemonHeight]
      const checkIndex = clone.findIndex(val => val===value)
      if (checkIndex === -1) {
        clone.push(value)
      } else {
        clone.splice(checkIndex, 1)
      }
      this.visiblePokemonHeight = clone;
    },
    onFilterHeight(scales: string[]): void{
      console.log(scales)
      if (!this.pokemons) {
        this.displayPokemons = null;
        return;
      }
      this.displayPokemons = [
        ...this.pokemons.filter((pokemon) => {
          if (!pokemon.detail) {
            return false;
          }
          return scales.includes(pokemon.detail().getHeightScale())
        }),
      ];
    },
    setPages (): void {
      if (!this.pokemons) {
        return 
      }
    let numberOfPages = Math.ceil(this.pokemons.length / 25);
    for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
    }
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
