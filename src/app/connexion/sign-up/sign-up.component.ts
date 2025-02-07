import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { icons } from '../../../ressources/icons';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventService } from '../../shared/event.service';
import { ConnexionService } from '../connexion.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: false,
})
export class SignUpComponent {
  icons = icons;
  @Output() toggleSign = new EventEmitter();
  filterForm!: FormGroup;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private events: EventService,
    private connexion: ConnexionService
  ) {}
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      email: [],
      password: [],
      displayName: [],
    });
  }
  toggleSignIn() {
    this.toggleSign.emit();
  }

  signUpWithEmailPassword() {
    const auth = getAuth();
    const { email, password, displayName } = this.filterForm.getRawValue();

    createUserWithEmailAndPassword(auth, email, password!)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName,
          //photoURL: 'https://example.com/jane-q-user/profile.jpg',
        })
          .then(() => {
            // Profile updated!
            // ...
            this.connexion.sync(user).subscribe((data) => {
              console.log({ user }, data);
              console.log('data:', data);
            });
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
}
