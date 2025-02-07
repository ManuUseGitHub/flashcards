import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionComponent } from './connexion.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConnexionComponent,
    SignUpComponent,
    SignInComponent,
    ProfileViewComponent,
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FontAwesomeModule],
})
export class ConnexionModule {}
