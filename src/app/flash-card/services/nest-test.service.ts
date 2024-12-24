import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { base, standardOptions } from '../../../ressources/httpHelper';
import { API_VERSION_ID_ORM } from '../../../ressources/microsevicesNames';
import { LOVs } from '../../../ressources/types';

const URL = base(API_VERSION_ID_ORM + '/test');

@Injectable({
  providedIn: 'root',
})
export class NestTestService {
  constructor(private http: HttpClient) {}

  greet() {
    const options = standardOptions;
    return this.http.get(URL, options);
  }

  registerLovs(characteristics:LOVs) {
    const options = standardOptions;
    return this.http.post(URL, characteristics, options);
  }
}
