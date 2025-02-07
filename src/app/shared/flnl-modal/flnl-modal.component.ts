import {
  AfterViewInit,
  Component,
  ContentChild,
  inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { generateKey, registerUser } from '../../../lib/mycrypto';
import { EventService } from '../event.service';
import { EVENTS } from '../../../ressources/enums';
import { SubscriberComponent } from '../subscriber/subscriber.component';

@Component({
  selector: 'app-flnl-modal',
  templateUrl: 'flnl-modal.component.html',
  styleUrl: './flnl-modal.component.scss',
  standalone: false,
})
export class FlnlModalComponent
  extends SubscriberComponent
  implements AfterViewInit, OnInit
{
  readonly dialog = inject(MatDialog);

  @Input() options: MatDialogConfig | undefined;
  @Input() data!: any;
  @Input() handler!: any;

  @ContentChild('title') titleTemplate!: TemplateRef<any>;
  @ContentChild('body') bodyTemplate!: TemplateRef<any>;
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;

  constructor(private events: EventService) {
    super();
  }
  ngOnInit(): void {
    this.subscribe(
      this.events.listen(EVENTS.OPEN_DIALOG, () => {
        this.openDialog();
        // Debug logs to ensure templates are captured
      }),
      this.events.listen(EVENTS.CLOSE_DIALOG, () => {
        this.closeDialog(null);
      })
    );
  }

  ngAfterViewInit() {
    generateKey((key) => {
      registerUser(
        {
          birthdate: new Date(),
          token: 'some token',
          username: 'sdfdgs',
          passwordhash: 'sdfgsdf',
        },
        key
      );
    });
  }

  openDialog(): void {
    
    this.dialog
      .open(DynamicDialogComponent, {
        data: {
          titleTemplate: this.titleTemplate,
          bodyTemplate: this.bodyTemplate,
          actionsTemplate: this.actionsTemplate,
        },
        hasBackdrop: false, // Ensures backdrop is set
        panelClass: 'dynamic-modal',
        autoFocus: false,
        width: '100vw', // Ensure width and height match your fullscreen requirement

        height: '100vh',
      })
      .afterClosed()
      .subscribe(this.handler);
  }
  closeDialog(event: any) {
    this.dialog.closeAll();
  }
}
