import { Component } from '@angular/core';
import { icons } from '../../ressources/icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { EventService } from '../shared/event.service';
import { mapSyncUser } from '../mappers/userMappers';
import { EVENTS } from '../../ressources/enums';
import { SubscriberComponent } from '../shared/subscriber/subscriber.component';

@Component({
    selector: 'app-connexion',
    templateUrl: './connexion.component.html',
    styleUrl: './connexion.component.scss',
    standalone: false
})
export class ConnexionComponent
  extends SubscriberComponent
{
  icons = icons;
  isSigningIn = true;
  user: any;

  get isAuthenticated() {
    return this.user != null;
  }

  constructor(private events: EventService) {
    super();
    const userSession = sessionStorage.getItem('user');
    this.user = userSession ? JSON.parse(userSession) : this.getLoggedUser();
    this.subscribe(
      events.listen(EVENTS.DISCONNECT, (event) => {
        this.user = null;
      })
    );
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
