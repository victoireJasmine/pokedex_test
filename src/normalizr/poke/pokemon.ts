import { BadInitializationError } from 'src/modules/errors';
import { Sprites } from './types/sprites';

export interface ResultPoke {
  name: string;
  url: string;
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

  constructor(data: Pokemon) {
    this.sprites = data.sprites;
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
  constructor(data: Pokemon) {
    super(data);
    if (!this.sprites) {
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
