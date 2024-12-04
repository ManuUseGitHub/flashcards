import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  standardOptions,
  handleError,
  base,
} from '../../../ressources/httpHelper';

//const URL = 'assets/database/filters/characteristics.json';
const URL = base('api/filters');

@Injectable({
  providedIn: 'root',
})
export class FlashCardFilterService {
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

  constructor(private http: HttpClient) {}
}
