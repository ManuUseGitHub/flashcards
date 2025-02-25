import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FlashCardPresetService } from '../flash-card/services/flash-card-preset.service';
import { icons } from '../../ressources/icons';
import { EventService } from '../shared/event.service';
import { Router } from '@angular/router';
import { EVENTS } from '../../ressources/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  title = 'Flash cards NL';
  isSidebarVisible = true;
  isSmallScreen = false;
  presetList: any = [];
  icons = icons;

  constructor(
    private presets: FlashCardPresetService,
    private events: EventService,
    @Inject(Router) private _router: Router
  ) {}

  ngOnInit(): void {
    this.presets.getPresets().subscribe((data) => {
      this.presetList = data;
    });

    this.detectScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.detectScreenSize();
  }

  detectScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    if (this.isSmallScreen) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  loadPreset(preset: any) {
    this.events.broadcast(EVENTS.LOAD_PRESET, {
      ...preset.preset,
      preset: preset.name,
    });
  }

  executePresetChoice(choice: string, preset: any) {
    if (choice == 'center') {
      this.loadPreset(preset);
    } else if (choice == 'left') {
      this.delete(preset.id);
    } else if (choice == 'right') {
      this.loadPreset(preset);
      this.launchTrainingSession();
    }
  }
  launchTrainingSession() {
    this.events.broadcast(EVENTS.SAVE_FILTERS, null);
    this._router.navigateByUrl('/cards');
  }
  delete(id: any) {
    this.presets.deletePresetById(id).subscribe((data) => {
      console.log('delete successfully');
    });
  }
}
