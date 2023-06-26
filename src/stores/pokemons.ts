import { defineStore } from 'pinia';
import {
  pokemons,
  detailPokemon,
  detailPokemonByUrl,
  speciesPokemon,
} from 'src/network/pokemon';
import { Pokemon } from 'src/normalizr/poke/pokemon';
import { ResultPoke } from 'src/normalizr/poke/result';
import { PokemonSpecies } from 'src/normalizr/poke/species';

export const usePokemonStore = defineStore('pokemons-store', {
  state: () => ({
    count: <number>0,
    next: <string | null>null,
    previous: <string | null>null,
    current: <string | null>null,
    pokemons: <ResultPoke[] | null>null,
  }),

  actions: {
    load(direction?: 'next' | 'previous' | 'current'): Promise<void> {
      let params: string | undefined = undefined;

      if (direction && direction !== 'current') {
        const directionUrl = (this[direction] as string).split('?');
        params = directionUrl[1];
      }

      if (direction === 'current') {
        params = this.current ?? undefined;
      } else {
        this.current = params || 'limit=24&offset=0';
      }

      this.pokemons = null;
      return pokemons(params)
        .then((data) => {
          this.previous = data.previous;
          this.next = data.next;
          this.count = data.count;
          return data.results;
        })
        .then(async (results) => {
          for (const result of results) {
            const getPokemon = await detailPokemonByUrl(result.url);
            result.detail = () => getPokemon;
          }
          return Promise.resolve(results);
        })
        .then((results) => {
          this.pokemons = results;
        });
    },
    getPokemonById(name: string): Promise<Pokemon> {
      const pokemon = this.pokemons?.find((poke) => poke.name === name);
      if (pokemon) {
        return Promise.resolve(pokemon.detail?.() as Pokemon);
      }

      return detailPokemon(name);
    },
    getSpeciciesPokemonById(name: string): Promise<PokemonSpecies> {
      return speciesPokemon(name);
    },
  },
});
