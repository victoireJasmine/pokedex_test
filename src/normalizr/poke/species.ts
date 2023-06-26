import { BadInitializationError } from 'src/modules/errors';
import { LinkValue } from './types/common';

export interface PokemonSpecies {
  id: number;
  base_happiness: number;
  capture_rate: number;
  color: LinkValue;
  form_descriptions: {
    [key: number]:
      | {
          description: string;
        }
      | undefined;
  };
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  pokedex_numbers: {
    entry_number: number;
    pokemon_species: LinkValue;
  }[];
}

abstract class AbstractPokemonSpecies implements PokemonSpecies {
  readonly id: number;
  readonly base_happiness: number;
  readonly capture_rate: number;
  readonly color: LinkValue;
  readonly form_descriptions: {
    [key: number]:
      | {
          description: string;
        }
      | undefined;
  };
  readonly is_legendary: boolean;
  readonly is_mythical: boolean;
  readonly is_baby: boolean;
  readonly pokedex_numbers: {
    entry_number: number;
    pokemon_species: LinkValue;
  }[];

  constructor(data: PokemonSpecies) {
    this.id = data.id;
    this.base_happiness = data.base_happiness;
    this.capture_rate = data.capture_rate;
    this.color = data.color;
    this.form_descriptions = data.form_descriptions;
    this.is_legendary = data.is_legendary;
    this.is_mythical = data.is_mythical;
    this.is_baby = data.is_baby;
    this.pokedex_numbers = data.pokedex_numbers;
  }
}

class PokemonSpeciesRead extends AbstractPokemonSpecies {
  declare readonly id: number;
  constructor(data: PokemonSpecies) {
    super(data);
    if (!this.id) {
      throw new BadInitializationError();
    }
  }
}

export class PokemonSpeciesFactory {
  static createPokemonSpecies(data: PokemonSpecies): PokemonSpeciesRead {
    return new PokemonSpeciesRead(data);
  }
}
