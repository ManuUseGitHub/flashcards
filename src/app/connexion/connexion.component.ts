import { Component } from '@angular/core';
import { icons } from '../../ressources/icons';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss',
})
export class ConnexionComponent {
  icons = icons;
  isSigningIn = true;
  toggleSign(event: any) {
    this.isSigningIn = !this.isSigningIn;
  }
}
