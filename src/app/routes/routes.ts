import { RouterModule } from '@angular/router';
import { FlashCardComponent } from '../flash-card/flash-card.component';
import { HomeComponent } from '../home/home.component';
import { MultiElementTableComponent } from '../multi-element-table/multi-element-table.component';
import { ConnexionComponent } from '../connexion/connexion.component';

export const routes = RouterModule.forRoot([
  { path: '', component: HomeComponent },
  { path: 'cards', component: FlashCardComponent },
  { path: 'additions', component: MultiElementTableComponent },
  { path: 'connexion', component: ConnexionComponent }
]);
