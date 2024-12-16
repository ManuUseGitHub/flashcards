import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  standardOptions,
  handleError,
  base,
} from '../../../ressources/httpHelper';
import { mapPreset } from '../../../ressources/mapper';
import { API_VERSION_ID_JSON_SERVER } from '../../../ressources/microsevicesNames';

const URL = base(API_VERSION_ID_JSON_SERVER + '/presets/');

@Injectable({
  providedIn: 'root',
})
export class FlashCardPresetService {
  getPresets() {
    const options = standardOptions;

    return this.http.get(URL, options).pipe(catchError(handleError));
  }

  deletePresetById(id: number) {
    const options = standardOptions;

    return this.http
      .delete(URL + `${id}`, options)
      .pipe(catchError(handleError));
  }

  createPreset(data: any) {
    const options = standardOptions;
    return this.http
      .post(URL, mapPreset(data), options)
      .pipe(catchError(handleError));
  }

  constructor(private http: HttpClient) {}
}
