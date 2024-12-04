import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {icons}  from '../../ressources/icons'

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss'],
  standalone: false,
})
export class LanguageToggleComponent implements OnInit {
  icons = icons;

  @Input()
  currentLanguage: string = 'none';

  @Input()
  controlName!: string;

  @Input()
  filterForm!: FormGroup;

  @Output()
  toggle = new EventEmitter<string>();

  currentText?: string;

  ngOnInit(): void {
    setTimeout(() => {
      this.currentLanguage = this.filterForm.get(this.controlName)!.value;
      this.currentText = this.currentLanguage === 'fr' ? 'French' : 'Dutch';
    }, 500);
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'fr' ? 'nl' : 'fr';
    this.currentText = this.currentLanguage === 'fr' ? 'French' : 'Dutch';
    this.toggle.emit(this.currentLanguage);
  }
}
