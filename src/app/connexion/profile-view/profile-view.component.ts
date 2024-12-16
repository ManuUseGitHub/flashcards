import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent {
  icons = icons;
  auth: Auth;
  user: any;
  constructor(private events: EventService) {
    initializeApp(environment.firebaseConfig);
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
        console.log(user);
      }
    });
  }
  disconnect() {
    this.auth.signOut().then(() => {
      this.events.broadcast(EVENTS.DISCONNECT.toString(), null);
    });
  }
}
