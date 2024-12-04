import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

type SpecificOptions = {
  option: string;
  value: any;
};
@Component({
  selector: 'app-form-selector-na',
  templateUrl: './form-selector-na.component.html',
  styleUrl: './form-selector-na.component.scss',
  standalone: false,
})
export class FormSelectorNaComponent implements OnInit {
  ngOnInit(): void {
    this.control = this.filterForm.get(this.controlName);
  }
  @Input({ transform: booleanAttribute }) compact: Boolean = false;
  @Input() filterForm!: FormGroup;
  @Input() text!: string;
  @Input() controlName!: string;
  @Input() options!: any;
  @Input() specifics!: SpecificOptions[];

  control: any = undefined;

  get isCompact() {
    return this.compact == true;
  }

  get getClassIfDefault() {
    return this.control.value == '*' ? '!text-gray-300' : '';
  }
}
