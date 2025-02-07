import { Component, Inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { icons } from '../../../ressources/icons';
import { mapSyncUser } from '../../mappers/userMappers';
import { ProfileUSer } from '../../DTOs/profileUser';
import { isAnniversary } from '../../../ressources/dateHelper';
import { flavours } from './Flavours';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleService } from '../title/title.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
  standalone: false,
})
export class ProfileViewComponent {
  titleStyles: string[] = flavours;
  profileForm!: FormGroup;
  flavour = 'random'; // title randomiser
  userTitle = 'Angular momentum webster mage';

  get joinedMesage() {
    if (this.user) {
      const anniversary = isAnniversary(this.user.dateJoin!.toString());

      if (anniversary.isAnniversary) {
        const yearComment =
          anniversary.diff > 0
            ? `. It has been ${anniversary.diff} Year(s) !`
            : '';
        return 'You joined by this date !! What a special day !' + yearComment;
      }
    }
    return '';
  }
  icons = icons;
  user?: ProfileUSer;
  constructor(
    private events: EventService,
    @Inject(FormBuilder) private fb: FormBuilder,
    private titleService: TitleService
  ) {
    const userSession = sessionStorage.getItem('user');
    this.user = userSession ? JSON.parse(userSession) : this.getLoggedUser();

    this.profileForm = fb.group({
      title: [],
    });
  }

  generateTitle(flavour: string) {
    if (flavour != '') {
      this.flavour = flavour;
    }
    this.titleService.generateTitle(this.flavour).subscribe((data: any) => {
      this.userTitle = data.title;
    });
  }

  getLoggedUser() {
    initializeApp(environment.firebaseConfig);
    let result = null;
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        result = mapSyncUser(user);
      }
    });
    return result;
  }

  disconnect() {
    sessionStorage.removeItem('user');
    initializeApp(environment.firebaseConfig);
    getAuth()
      .signOut()
      .then(() => {
        this.events.broadcast(EVENTS.DISCONNECT, null);
      });
  }
}
