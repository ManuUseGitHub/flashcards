import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { API_VERSION_ID_ORM } from '../../ressources/microsevicesNames';
import { base } from '../../ressources/httpHelper';
import { mapSyncUser } from '../mappers/userMappers';

const URL = base(API_VERSION_ID_ORM + '/user');

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  sync(user: User) {
    return this.http.post(URL + '/sync', mapSyncUser(user));
  }

  getUser(uid: string) {
    return this.http.get(URL + '/' + uid);
  }

  constructor(private http: HttpClient) {}
}
