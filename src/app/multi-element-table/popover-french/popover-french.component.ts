import { Component, Input } from '@angular/core';
import { introducedValue } from '../../../lib/strings';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-popover-french',
  templateUrl: './popover-french.component.html',
  styleUrl: './popover-french.component.scss',
  standalone: false,
})
export class PopoverFrenchComponent {
  @Input() i!: number;
  @Input() row!: any;
  getFrench(row: any) {
    return [introducedValue('', row.controls.french.value) || ''];
  }
}
