import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-born-selector',
  templateUrl: './born-selector.component.html',
  styleUrl: './born-selector.component.scss',
  standalone: false,
})
export class BornSelectorComponent {
  @Input()
  label!: string;

  @Input()
  controlName!: string;

  @Input()
  controlNameLow!: string;
  @Input()
  controlNameHigh!: string;

  @Input()
  filterForm!: FormGroup;

  @Input()
  options!: string[];

  @Input()
  values!: string[];

  isLowDisplayed() {
    return /BETWEEN|OVER/.test(this.filterForm.get(this.controlName)!.value);
  }

  isHighDisplayed() {
    return /BETWEEN|BELLOW/.test(this.filterForm.get(this.controlName)!.value);
  }

  get discrim() {
    return this.filterForm.get(this.controlName)?.value;
  }

  shouldHide(condition: boolean) {
    return {
      hidden: condition,
      'max-w-0': condition,
    };
  }
}
