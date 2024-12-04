import { Component, Input } from '@angular/core';
import { introducedValue } from '../../../lib/strings';

@Component({
  selector: 'app-popover-course',
  templateUrl: './popover-course.component.html',
  styleUrl: './popover-course.component.scss',
  standalone: false,
})
export class PopoverCourseComponent {
  @Input() themes!: string[];
  @Input() parts!: string[];
  @Input() chapters!: string[];
  @Input() row!: any;
  @Input() i!: number;

  getCourses(row: any) {
    return [
      introducedValue('', row.controls.theme.value, this.themes) || 'theme : /',
      introducedValue('', row.controls.chapter.value, this.chapters) ||
        'chapter : /',
      introducedValue('', row.controls.part.value, this.parts) || 'part : /',
    ];
  }
}
