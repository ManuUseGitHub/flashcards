import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { icons } from '../../../ressources/icons';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConnexionService } from '../connexion.service';
import { mapSyncUser } from '../../mappers/userMappers';
import { removeNull } from '../../mappers/commonFieldFilter';
import { SyncUser } from '../../DTOs/syncUser';
import { ProfileUSer } from '../../DTOs/profileUser';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    standalone: false
})
export class SignInComponent implements OnInit {
  @Output() toggleSign = new EventEmitter();
  icons = icons;

  authForm!: FormGroup;

  constructor(@Inject(FormBuilder) private fg: FormBuilder, private connexion: ConnexionService) {
    const userSession = sessionStorage.getItem('user');
    if (!userSession) {
      initializeApp(environment.firebaseConfig);
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          connexion.getUser(user.uid).subscribe((data) => {
            const userFromFirebase = mapSyncUser(user);
            const userFetched = removeNull(data as ProfileUSer);
            const syncedUser = Object.assign(userFromFirebase, userFetched);
            sessionStorage.setItem('user', JSON.stringify(syncedUser));
          });
        } else {
          // User is signed out
          // ...
        }
      });
    }
  }

  ngOnInit(): void {
    this.authForm = this.fg.group({
      email: [],
      password: [],
    });
  }

  toggleSignIn() {
    this.toggleSign.emit();
  }

  signInWithEmailPassword() {
    const auth = getAuth();
    const { email, password } = this.authForm.getRawValue();

    signInWithEmailAndPassword(auth, email, password!)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        this.connexion.sync(user).subscribe((data) => {
          console.log('data:', data);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  signinViaGoolg() {
    initializeApp(environment.firebaseConfig);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({});
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

        this.connexion.sync(user).subscribe((data) => {
          console.log('data:', data);
          location.reload();
        });
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
