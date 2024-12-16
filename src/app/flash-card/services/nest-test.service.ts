import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { base, standardOptions } from '../../../ressources/httpHelper';
import { API_VERSION_ID_ORM } from '../../../ressources/microsevicesNames';

const URL = base(API_VERSION_ID_ORM + '/test');

@Injectable({
  providedIn: 'root',
})
export class NestTestService {
  constructor(private http: HttpClient) {}

  great() {
    const options = standardOptions;
    return this.http.get(URL, options);
  }
}
