import * as Hashids from 'hashids';
import { Injectable } from '@angular/core';

@Injectable()
export class EvHashId {
  hashids = new Hashids('gherdasfa5tvw5tc123ascpiombnu2a0', 10);

  constructor() {

  }

  encode(id: number): string {
    return this.hashids.encode(id);
  }

  decode(id: string): number {
    return this.hashids.decode(id);
  }


}
