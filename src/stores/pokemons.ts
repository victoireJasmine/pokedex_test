import { defineStore } from 'pinia';
import { pokemons, detailPokemon } from 'src/network/pokemon';
import { Pokemon, ResultPoke } from 'src/normalizr/poke/pokemon';

export const usePokemonStore = defineStore('pokemons-store', {
  state: () => ({
    count: <number>0,
    next: <string | null>null,
    previous: <string | null>null,
    pokemons: <ResultPoke[] | null>null,
    ready: <boolean>false,
  }),

  actions: {
    load(): Promise<void> {
      this.ready = false;
      return pokemons()
        .then((data) => {
          this.previous = data.previous;
          this.next = data.next;
          this.count = data.count;
          return data.results;
        })
        .then(async (results) => {
          for (const result of results) {
            const getPokemon = await detailPokemon(result.url);
            result.detail = () => getPokemon;
          }
          return Promise.resolve(results);
        })
        .then((results) => {
          this.pokemons = results;
        });
    },
  },
});
