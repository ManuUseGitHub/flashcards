import { Component, EventEmitter, Output } from '@angular/core';
import { icons } from '../../../ressources/icons';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  icons = icons;
  @Output() toggleSign = new EventEmitter();
  
  toggleSignIn() {
    this.toggleSign.emit();
  }

  private user: any;

  constructor() {
    initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        // User is signed out
        // ...
      }
    });
  }

  signinViaGoolg() {
    initializeApp(environment.firebaseConfig);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log({ token, user, credential });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
}
