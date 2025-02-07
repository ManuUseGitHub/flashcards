import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hr-titled',
  templateUrl: './hr-titled.component.html',
  styleUrl: './hr-titled.component.scss',
  standalone: false,
})
export class HrTitledComponent {
  @Input() text: string = 'Separator';
  @Input() options!: {
    sepClassnames?: string[];
    hrClassnames?: string[];
  };

  get classNames() {
    const copy = { ...this.options };
    return {
      sepClassnames: copy.sepClassnames?.join(' '),
      hrClassnames: copy.hrClassnames?.join(' '),
    };
  }
}
