import { Component, Input } from '@angular/core';
import { introducedValue } from '../../../lib/strings';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-popover-dutch',
  templateUrl: './popover-dutch.component.html',
  styleUrl: './popover-dutch.component.scss',
  standalone: false,
})
export class PopoverDutchComponent {
  icons = icons;

  @Input() articles!: string[];
  @Input() i!: number;
  @Input() row!: any;

  getDutch(row: any) {
    const article = row.controls.article.value;
    return [
      introducedValue(
        '',
        (article ? article + ' ' : '') + (row.controls.dutch.value || '')
      ),
    ];
  }
}
