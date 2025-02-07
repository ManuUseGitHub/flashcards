import { Injectable, inject } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  base,
  handleError,
  standardOptions,
} from '../../../ressources/httpHelper';
import { CardAddition, CardEntry, CardModify } from '../../../ressources/types';
import { API_VERSION_ID_JSON_SERVER } from '../../../ressources/microsevicesNames';

const options = standardOptions;

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  private http = inject(HttpClient);

  options = standardOptions;

  getCards() {
    return this.http
      .get(base(API_VERSION_ID_JSON_SERVER), options)
      .pipe(catchError(handleError));
  }

  update(entity: CardModify) {
    return this.http
      .put(base(API_VERSION_ID_JSON_SERVER + '/card'), entity, options)
      .pipe(catchError(handleError));
  }

  add(records: CardAddition) {
    return this.http
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
