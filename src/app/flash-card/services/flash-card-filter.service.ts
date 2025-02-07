import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  standardOptions,
  handleError,
  base,
} from '../../../ressources/httpHelper';
import { API_VERSION_ID_JSON_SERVER } from '../../../ressources/microsevicesNames';

//const URL = 'assets/database/filters/characteristics.json';
const URL = base(API_VERSION_ID_JSON_SERVER + '/filters');

@Injectable({
  providedIn: 'root',
})
export class FlashCardFilterService {
  private http = inject(HttpClient);

  update() {
    const options = standardOptions;
    return this.http
      .put(
        URL,
        {
          motif: 'sync',
        },
        options
      )
      .pipe(catchError(handleError));
  }
  getCharacteristics() {
    const options = standardOptions;
    return this.http.get(URL, options).pipe(catchError(handleError));
  }
}
