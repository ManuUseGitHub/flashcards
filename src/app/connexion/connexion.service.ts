import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { API_VERSION_ID_NEXT } from '../../ressources/microsevicesNames';
import { base, standardOptions } from '../../ressources/httpHelper';
import { mapSyncUser } from '../mappers/userMappers';

const URL = base(API_VERSION_ID_NEXT + '/user');

const options = standardOptions;

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  private http = inject(HttpClient);

  sync(user: User) {
    return this.http.post(URL + '/sync', mapSyncUser(user), options);
  }

  getUser(uid: string) {
    return this.http.get(URL + '/' + uid, options);
  }
}
