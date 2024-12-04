import { Injectable } from '@angular/core';
import { CardEntry, EffectiveFilters } from '../ressources/types';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  constructor() {}

  sumTests(...tests: number[]) {
    let score = 0;
    tests.forEach((t) => {
      if (t != 0) {
        score += t;
      }
    });
    return score >= 0;
  }
}
