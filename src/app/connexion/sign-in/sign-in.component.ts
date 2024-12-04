import { Component, EventEmitter, Output } from '@angular/core';
import { icons } from '../../../ressources/icons';

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
}
