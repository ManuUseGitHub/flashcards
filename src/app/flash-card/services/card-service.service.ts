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
import { API_VERSION_ID_JSON_SERVER } from '../../../ressources/microsevicesNames';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  options = standardOptions;

  constructor(private http: HttpClient) {}

  getCards() {
    return (
      this.http
        //.get('assets/database/db.json', options)
        .get(base(API_VERSION_ID_JSON_SERVER))
        .pipe(catchError(handleError))
    );
  }

  update(entity: CardEntry) {
    this.http
      //.get('assets/database/db.json', options)
      .put(base(API_VERSION_ID_JSON_SERVER + '/card'), entity as modifyCardDAO)
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }

  add(records: CardAddition) {
    this.http
      //.get('assets/database/db.json', options)
      .post(base(API_VERSION_ID_JSON_SERVER + '/card'), records as CardAddition)
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }
}
