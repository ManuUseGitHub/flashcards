import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { base } from '../../../ressources/httpHelper';
import { API_VERSION_ID_NEXT } from '../../../ressources/microsevicesNames';

const URL = base(API_VERSION_ID_NEXT + '/title');

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private client = inject(HttpClient);


  generateTitle(flavour: string) {
    return this.client.get(URL + '/' + flavour);
  }
}
