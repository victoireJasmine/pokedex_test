import { BadInitializationError } from 'src/modules/errors';
import { Sprites } from './types/sprites';
import { LinkValue } from './types/common';
import { TypePokemon } from './types/type';
import { heightScale } from 'src/shared/constant';

export interface ResultPoke extends LinkValue {
  detail?: () => Pokemon;
}
export interface PokemonResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultPoke[];
}

export interface Pokemon {
  sprites: Sprites;
  types: TypePokemon[];
  height: number;
  id: number;
  order: number;
  getTypes: () => string[];
  getNumber: () => string;
  getHeightScale: () => string;
}

abstract class AbstractPokemonResult implements PokemonResult {
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
  results: ResultPoke[];

  constructor(data: PokemonResult) {
    this.count = data.count;
    this.next = data.next;
    this.previous = data.previous;
    this.results = data.results;
  }
}

abstract class AbstractPokemonDetail implements Pokemon {
  readonly sprites: Sprites;
  readonly types: TypePokemon[];
  readonly height: number;
  readonly id: number;
  readonly order: number;

  constructor(data: Pokemon) {
    this.sprites = data.sprites;
    this.types = data.types;
    this.height = data.height;
    this.id = data.id;
    this.order = data.order;
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
}

class PokemonResultRead extends AbstractPokemonResult {
  declare readonly results: ResultPoke[];
  constructor(data: PokemonResult) {
    super(data);
    if (!this.results) {
      throw new BadInitializationError();
    }
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
  static fromResult(data: PokemonResult): PokemonResultRead {
    return new PokemonResultRead(data);
  }
  static createPokemon(data: Pokemon): PokemonDetailRead {
    return new PokemonDetailRead(data);
  }
}
