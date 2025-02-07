import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CardEntry } from '../../../../ressources/types';
import { FormGroup } from '@angular/forms';
import { icons } from '../../../../ressources/icons';
import { EventService } from '../../../shared/event.service';
import { EVENTS } from '../../../../ressources/enums';
import { SubscriberComponent } from '../../../shared/subscriber/subscriber.component';

@Component({
    selector: 'app-filtered-table-dialog-button',
    templateUrl: './filtered-table-dialog-button.component.html',
    styleUrl: './filtered-table-dialog-button.component.scss',
    standalone: false
})
export class FilteredTableDialogButtonComponent extends SubscriberComponent {
  @Input()
  filterForm!: FormGroup;
  @Input()
  composedList!: CardEntry[];
  @Input()
  dataSource!: MatTableDataSource<CardEntry>;
  icons = icons;

  editing: any;

  get isCardLoaded() {
    return !!this.editing;
  }

  constructor(private events: EventService) {
    super();
    this.subscribe(
      this.events.listen(EVENTS.LOAD_CARD, (data) => {
        this.editing = data;
      }),
      this.events.listen(EVENTS.CLOSE_DIALOG, () => {
        this.cancelEdit();
      }),
      this.events.listen(EVENTS.APPLY_FILTERS, () => {
        /* DEBUG: delete after debug*/
        events.broadcast(EVENTS.OPEN_DIALOG, null);
        /*
        setTimeout(() => {
          
          events.broadcast(EVENTS.LOAD_CARD, this.composedList[4]);
          setTimeout(() => {
            this.editing.dutch =
              this.editing.dutch == 'De vork' ? 'De fork' : 'De vork';

              console.log("EDIT",this.editing)
            this.saveEdit();
          }, 1000);
        }, 200); /**/
      })
    );
  }

  saveEdit() {
    this.events.broadcast(EVENTS.SAVE_CARD, this.editing);
  }

  cancelEdit() {
    this.editing = null;
  }
}
