import { BadInitializationError } from 'src/modules/errors';
import { LinkValue } from './types/common';
import { heightScale } from 'src/shared/constant';
import { PokemonSpecies } from './species';

interface Sprites {
  back_default: string;
  front_default: string;
  other: {
    dream_world: {
      front_default: string;
    };
  };
}

interface TypePokemon {
  slot: number;
  type: LinkValue;
}

interface Ability {
  ability: LinkValue;
  is_hidden: boolean;
}

interface Stat {
  base_stat: number;
  stat: LinkValue;
  effort: number;
}

export interface Pokemon {
  sprites: Sprites;
  species: LinkValue;
  types: TypePokemon[];
  height: number;
  id: number;
  order: number;
  name: string;
  weight: number;
  abilities: Ability[];
  stats: Stat[];
  getTypes: () => string[];
  getSpecies?: () => PokemonSpecies[];
  getNumber: () => string;
  getHeightScale: () => string;
  getFrontDefault: () => string;
}

abstract class AbstractPokemonDetail implements Pokemon {
  readonly sprites: Sprites;
  readonly types: TypePokemon[];
  readonly height: number;
  readonly id: number;
  readonly order: number;
  readonly name: string;
  readonly weight: number;
  readonly species: LinkValue;
  readonly abilities: Ability[];
  readonly stats: Stat[];

  constructor(data: Pokemon) {
    this.sprites = data.sprites;
    this.types = data.types;
    this.height = data.height;
    this.id = data.id;
    this.order = data.order;
    this.name = data.name;
    this.weight = data.weight;
    this.species = data.species;
    this.abilities = data.abilities;
    this.stats = data.stats;
  }

  getTypes(): string[] {
    return this.types.map((type) => type.type.name);
  }

  getNumber(): string {
    if (this.id < 10) {
      return `00${this.id}`;
    }
    if (this.id < 100) {
      return `0${this.id}`;
    }
    return this.id.toString();
  }

  getHeightScale(): string {
    if (this.height <= 10) {
      return heightScale.small;
    }
    if (this.height > 10 && this.height < 30) {
      return heightScale.medium;
    }
    return heightScale.large;
  }

  getFrontDefault(): string {
    return this.sprites.other.dream_world.front_default;
  }
}

class PokemonDetailRead extends AbstractPokemonDetail {
  declare readonly sprites: Sprites;
  declare readonly types: TypePokemon[];
  declare readonly height: number;
  constructor(data: Pokemon) {
    super(data);
    if (!this.sprites || !this.types || !this.height) {
      throw new BadInitializationError();
    }
  }
}
export class PokemonFactory {
  static createPokemon(data: Pokemon): PokemonDetailRead {
    return new PokemonDetailRead(data);
  }
}
