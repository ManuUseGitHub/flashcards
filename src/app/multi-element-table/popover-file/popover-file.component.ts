import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { zeroPad } from '../../../maths.helper';
import { icons } from '../../../ressources/icons';
import { introducedValue } from '../../../lib/strings';

@Component({
  selector: 'app-popover-file',
  templateUrl: './popover-file.component.html',
  styleUrl: './popover-file.component.scss',
  standalone: false,
})
export class PopoverFileComponent implements OnInit {
  icons = icons;

  @Input() files!: string[];
  @Input() globalForm!: FormGroup;

  getFiles() {
    return [
      introducedValue(
        ' ',
        this.globalForm.controls['file'].getRawValue(),
        this.files
      ),
    ];
  }
  ngOnInit(): void {
    this.addDate();
  }
  doesEndByDate(actual: any) {
    return /D[\d]{8}T[\d]{6}$/.test(actual || '');
  }
  doesNotEndByDate(actual: any) {
    return !this.doesEndByDate(actual);
  }
  addDate() {
    const actual = this.globalForm.controls['file'].getRawValue();
    if (this.doesNotEndByDate(actual)) {
      this.globalForm.patchValue({
        file: actual + '_' + this.nowDate(),
      });
    }
  }
  removeDate() {
    const actual = this.globalForm.controls['file'].getRawValue();
    if (this.doesEndByDate(actual)) {
      const exempted = /(?<file>.*)_D[\d]{8}T[\d]{6}$/.exec(actual);
      this.globalForm.patchValue({
        file: exempted!.groups!['file'],
      });
    }
  }

  nowDate(): any {
    const d = new Date(),
      month = zeroPad(d.getMonth() + 1, 2),
      day = zeroPad(d.getDate(), 2),
      year = 'D' + zeroPad(d.getFullYear(), 4),
      hour = 'T' + zeroPad(d.getHours(), 2),
      minutes = zeroPad(d.getMinutes(), 2),
      seconds = zeroPad(d.getSeconds(), 2);
    return [year, month, day, hour, minutes, seconds].join('');
  }
}
