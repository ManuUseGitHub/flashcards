import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EVENTS } from '../../../ressources/enums';
import { EventService } from '../event.service';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { SubscriberComponent } from '../subscriber/subscriber.component';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss',
  standalone: false,
})
export class AutoCompleteComponent
  extends SubscriberComponent
  implements OnInit
{
  @ViewChild(MatAutocomplete) auto!: any;
  @ViewChild(MatAutocompleteTrigger) autoTrigger!: MatAutocompleteTrigger;

  @Input()
  myClass = 'w-full';
  @Input()
  inputGroup!: FormGroup;
  @Input()
  options!: string[];
  @Input()
  name!: string;
  @Input()
  placeholder: any = '';
  @Input()
  canClose: boolean = false;

  filteredOptions!: Observable<string[]>;
  visibleOptions: boolean = true;
  escapeCount: number = 0;
  isMouseIn: boolean = false;
  timer: any;

  constructor(private events: EventService) {
    super();
  }

  toggleAutoComplete(event: any) {
    this.visibleOptions = !this.visibleOptions;
  }
  resetVisibility() {
    this.visibleOptions = true;
  }
  lostFocus(event: any) {
    setTimeout(() => {
      this.auto.showPanel = false;
    }, 500);
  }

  ngOnInit() {
    this.filteredOptions = this.inputGroup.get(this.name)!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.subscribe(
      ...[
        this.events.listen(EVENTS.CLOSE_OTHER_POPOVERS, () => {
          this.auto.showPanel = false;
        }),
      ]
    );
  }

  handleKeyEscape(event: any) {
    if (event.key == 'Escape') {
      this.events.broadcast(EVENTS.ESCAPED, event);
    }
  }
  resetEscapeCount(event: any) {
    this.events.broadcast(EVENTS.RESET_ESCAPER, event);
  }

  private _filter(value: string): string[] {
    const filterValue = `${value}`.toLowerCase();

    return this.options.filter((option) => {
      return `${option}`.toLowerCase().includes(filterValue);
    });
  }
}
