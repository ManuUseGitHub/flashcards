import { Injectable,  } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  base,
  handleError,
  standardOptions,
} from '../../../ressources/httpHelper';
import { CardAddition, CardEntry } from '../../../ressources/types';
import { modifyCardDAO } from './daos';
import { API_VERSION_ID_JSON_SERVER } from '../../../ressources/microsevicesNames';

const options = standardOptions;

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  options = standardOptions;

  constructor(private http: HttpClient) {}

  getCards() {
    return this.http
      .get(base(API_VERSION_ID_JSON_SERVER), options)
      .pipe(catchError(handleError));
  }

  update(entity: CardEntry) {
    this.http
      .put(
        base(API_VERSION_ID_JSON_SERVER + '/card'),
        entity as modifyCardDAO,
        options
      )
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }

  add(records: CardAddition) {
    this.http
      .post(
        base(API_VERSION_ID_JSON_SERVER + '/card'),
        records as CardAddition,
        options
      )
      .pipe(catchError(handleError))
      .subscribe((data) => {
        console.log(data);
      });
  }
}
