import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { touch } from '../../../aparte/aparte.builder';
import { icons } from '../../../ressources/icons';
import { DialogState } from '../../services/dialog-navigation.service';
import { EventService } from '../../services/event.service';
import { Subscribing } from '../../shared/subscribing';

@Component({
  selector: 'app-root-csv',
  templateUrl: './root-csv.component.html',
  styleUrl: './root-csv.component.scss',
  standalone: false,
})
export class RootCSVComponent extends Subscribing {
  icons = icons;

  get state() {
    return this._state;
  }
  @ViewChild('child') child!: any;

  _state = DialogState.CSV;

  isOfState(
    name:
      | 'CSV'
      | 'CREATE'
      | 'FILE'
      | 'CONFIG'
      | 'CONFIG_AUTOMATION'
      | 'CONFIG_API_KEY'
  ) {
    return (this._state as any) == DialogState[name];
  }

  constructor(
    @Inject(FormBuilder) protected fb: FormBuilder,
    protected override events: EventService
  ) {
    super(events);
    this.listenDoing({ NAVIGATE: 'ui.dialog' }, (data) => {
      if (data == 'close') {
        // TODO: implement prevent navigation "close" if needed here
        this.broadcast(touch({ CLOSE_DIALOG: 'ui.dialog' }), null);
      } else {
        this._state = data;
      }
    });
    this.listenDisapointed({ NAVIGATE: 'ui.dialog' }, (data) => {
      //console.log(data);
    });
  }
}
