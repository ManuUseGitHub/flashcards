import { Component } from '@angular/core';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
})
export class NavBarComponent {
  icons = icons
  logout() {
    // Implement your logout logic here
    console.log('User logged out');
  }
}
