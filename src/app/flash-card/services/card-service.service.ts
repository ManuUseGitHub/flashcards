import { Injectable, isDevMode } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  base,
  handleError,
  standardOptions,
} from '../../../ressources/httpHelper';
import { CardAddition, CardEntry } from '../../../ressources/types';
import { modifyCardDAO } from './daos';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  options = standardOptions;

  getCards() {
    return (
      this.http
        //.get('assets/database/db.json', options)
        .get(base('api/'))
        .pipe(catchError(handleError))
    );
  }

  update(entity: CardEntry) {
    this.http
      //.get('assets/database/db.json', options)
      .put(base('api/card'), entity as modifyCardDAO)
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }

  add(records: CardAddition) {
    this.http
      //.get('assets/database/db.json', options)
      .post(base('api/card'), records as CardAddition)
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }

  constructor(private http: HttpClient) {}
}
