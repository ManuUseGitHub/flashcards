import { Component } from '@angular/core';
import { icons } from '../../ressources/icons';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss',
})
export class ConnexionComponent {
  icons = icons;
  isSigningIn = true;
  user: any;

  get isAuthenticated() {
    return this.user != null;
  }

  constructor() {
    initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        console.log(user);
      } else {
        // User is signed out
        // ...
      }
    });
  }

  toggleSign(event: any) {
    this.isSigningIn = !this.isSigningIn;
  }
}
