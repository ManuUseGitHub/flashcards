import { Component, Input } from '@angular/core';
import { introducedValue } from '../../../lib/strings';

@Component({
  selector: 'app-popover-analysis',
  templateUrl: './popover-analysis.component.html',
  styleUrl: './popover-analysis.component.scss',
  standalone: false,
})
export class PopoverAnalysisComponent {
  @Input() difficulties = [];
  @Input() types = [];
  @Input() row!: any;
  @Input() i!: number;

  getAnalysis(row: any) {
    return [
      introducedValue('Gram. : ', row.controls.type.value, this.types) ||
        'Gram. Type : /',
      introducedValue(
        'difficulty : ',
        row.controls.difficulty.value,
        this.difficulties
      ) || 'Difficulty : /',
    ];
  }
}
