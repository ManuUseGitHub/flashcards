import { Component, EventEmitter, Output } from '@angular/core';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  icons = icons;
  @Output() toggleSign = new EventEmitter();

  toggleSignIn() {
    this.toggleSign.emit();
  }
}
