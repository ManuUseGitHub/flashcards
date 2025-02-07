import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { ConnexionModule } from './connexion/connexion.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { FlashCardModule } from './flash-card/flash-card.module';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, HomeComponent, NavBarComponent],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FlashCardModule,
    SharedModule,
    ConnexionModule,
  ],
  providers: [provideAnimationsAsync(), provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
