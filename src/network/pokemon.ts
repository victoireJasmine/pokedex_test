import { apis } from 'src/boot/axios';
import { AxiosResponse } from 'axios';
import { PokemonFactory, Pokemon } from 'src/normalizr/poke/pokemon';
import { PokemonResult, PokemonResultFactory } from 'src/normalizr/poke/result';
import {
  PokemonSpecies,
  PokemonSpeciesFactory,
} from 'src/normalizr/poke/species';

export const pokemons = (
  params: string | undefined = 'limit=24&offset=0'
): Promise<PokemonResult> => {
  let url = '/pokemon';
  if (params) {
    url += '?' + params;
  }
  return apis.poke
    .get(url)
    .then((response: AxiosResponse): Promise<PokemonResult> => {
      return Promise.resolve(PokemonResultFactory.fromResult(response.data));
    });
};

export const detailPokemonByUrl = (url: string): Promise<Pokemon> => {
  return apis
    .empty(url)
    .get('')
    .then((response: AxiosResponse): Promise<Pokemon> => {
      return Promise.resolve(PokemonFactory.createPokemon(response.data));
    });
};

export const detailPokemon = (id: string): Promise<Pokemon> => {
  return apis.poke
    .get(`/pokemon/${id}`)
    .then((response: AxiosResponse): Promise<Pokemon> => {
      return Promise.resolve(PokemonFactory.createPokemon(response.data));
    });
};

export const speciesPokemonByUrl = (url: string): Promise<PokemonSpecies> => {
  return apis
    .empty(url)
    .get('')
    .then((response: AxiosResponse): Promise<PokemonSpecies> => {
      return Promise.resolve(
        PokemonSpeciesFactory.createPokemonSpecies(response.data)
      );
    });
};

export const speciesPokemon = (id: string): Promise<PokemonSpecies> => {
  return apis.poke
    .get(`/pokemon-species/${id}`)
    .then((response: AxiosResponse): Promise<PokemonSpecies> => {
      return Promise.resolve(
        PokemonSpeciesFactory.createPokemonSpecies(response.data)
      );
    });
};
