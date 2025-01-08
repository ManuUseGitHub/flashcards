import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { base } from '../../../ressources/httpHelper';
import { API_VERSION_ID_ORM } from '../../../ressources/microsevicesNames';

const URL = base(API_VERSION_ID_ORM + '/title');

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private client: HttpClient) {}

  generateTitle(flavour: string) {
    return this.client.get(URL + '/' + flavour);
  }
}
