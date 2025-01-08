import { Component, OnDestroy } from '@angular/core';
import { icons } from '../../ressources/icons';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { EventService } from '../shared/event.service';
import { mapSyncUser } from '../mappers/userMappers';
import { Subscription } from 'rxjs';
import { EVENTS } from '../../ressources/enums';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss',
})
export class ConnexionComponent implements OnDestroy {
  icons = icons;
  isSigningIn = true;
  user: any;
  services: Subscription[] = [];

  get isAuthenticated() {
    return this.user != null;
  }

  constructor(private events: EventService) {
    const userSession = sessionStorage.getItem('user');
    this.user = userSession ? JSON.parse(userSession) : this.getLoggedUser();
    this.services.push(
      events.listen(EVENTS.DISCONNECT.toString(), (event) => {
        this.user = null;
      })
    );
  }
  ngOnDestroy(): void {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }

  getLoggedUser() {
    initializeApp(environment.firebaseConfig);
    let result = null;
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        result = mapSyncUser(user);
      }
    });
    return result;
  }

  toggleSign(event: any) {
    this.isSigningIn = !this.isSigningIn;
  }
}
