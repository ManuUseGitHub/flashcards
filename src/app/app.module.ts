import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlashCardModule } from './flash-card/flash-card.module';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { routes } from './routes/routes';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NavBarComponent],
  imports: [
    routes,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FlashCardModule,
    FontAwesomeModule,
    SharedModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
