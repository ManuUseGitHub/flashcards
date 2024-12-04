import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { icons } from '../../../ressources/icons';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DynamicDialogComponent implements AfterViewInit {
  icons = icons;
  dialogRef: any;
  @ViewChild('.close')
  closeButton: any;
  onClose: () => boolean | undefined;

  constructor(
    public dialog: MatDialogRef<DynamicDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleTemplate: TemplateRef<any>;
      bodyTemplate: TemplateRef<any>;
      actionsTemplate: TemplateRef<any>;
      onClose: () => boolean | undefined;
    },
    private elem: ElementRef
  ) {
    this.dialogRef = dialog;
    this.onClose = data.onClose;
  }
  close(event: any) {
    const shouldClose = this.onClose ? this.onClose() : true;

    if (shouldClose) {
      this.dialogRef.close();
    }
  }

  ngAfterViewInit(): void {
    this.elem.nativeElement.querySelectorAll('.close').forEach((e: Element) => {
      e.addEventListener('click', (event) => {
        this.close(event);
      });
    });
  }
}
