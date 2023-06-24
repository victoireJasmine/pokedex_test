import { apis } from 'src/boot/axios';
import { AxiosResponse } from 'axios';
import {
  PokemonResult,
  PokemonFactory,
  Pokemon,
} from 'src/normalizr/poke/pokemon';

export const pokemons = (
  params: URLSearchParams | null = null
): Promise<PokemonResult> => {
  let url = '/pokemon';
  if (params?.toString()) {
    url += '&' + params.toString();
  }
  return apis.poke
    .get(url)
    .then((response: AxiosResponse): Promise<PokemonResult> => {
      return Promise.resolve(PokemonFactory.fromResult(response.data));
    });
};

export const detailPokemon = (url: string): Promise<Pokemon> => {
  return apis
    .empty(url)
    .get('')
    .then((response: AxiosResponse): Promise<Pokemon> => {
      return Promise.resolve(PokemonFactory.createPokemon(response.data));
    });
};
