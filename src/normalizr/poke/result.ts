import { BadInitializationError } from 'src/modules/errors';
import { LinkValue } from './types/common';
import { Pokemon } from './pokemon';

export interface ResultPoke extends LinkValue {
  detail?: () => Pokemon;
}

export interface PokemonResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultPoke[];
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

class PokemonResultRead extends AbstractPokemonResult {
  declare readonly results: ResultPoke[];
  constructor(data: PokemonResult) {
    super(data);
    if (!this.results) {
      throw new BadInitializationError();
    }
  }
}

export class PokemonResultFactory {
  static fromResult(data: PokemonResult): PokemonResultRead {
    return new PokemonResultRead(data);
  }
}
