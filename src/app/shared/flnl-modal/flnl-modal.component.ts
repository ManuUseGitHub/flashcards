import {
  AfterViewInit,
  Component,
  ContentChild,
  inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { generateKey, registerUser } from '../../../lib/mycrypto';

@Component({
  selector: 'app-flnl-modal',
  templateUrl: 'flnl-modal.component.html',
  styleUrl: './flnl-modal.component.scss',
  standalone: false,
})
export class FlnlModalComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);

  @Input()
  options: MatDialogConfig | undefined;
  @Input() data!: any;
  @Input() handler!: any;

  @ContentChild('title') titleTemplate!: TemplateRef<any>;
  @ContentChild('body') bodyTemplate!: TemplateRef<any>;
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // Debug logs to ensure templates are captured
    //this.openDialog();

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
        panelClass: 'dynamic-modal',
        autoFocus: false,
        width: '100vw', // Ensure width and height match your fullscreen requirement

        height: '100vh',
      })
      .afterClosed()
      .subscribe(this.handler);
  }
  closeDialog(event: any) {}
}
