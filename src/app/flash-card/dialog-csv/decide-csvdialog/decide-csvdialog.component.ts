import { Component } from '@angular/core';
import { DialogState } from '../../../services/dialog-navigation.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';
import { icons } from '../../../../ressources/icons';

@Component({
  selector: 'app-decide-csvdialog',
  templateUrl: './decide-csvdialog.component.html',
  styleUrl: './decide-csvdialog.component.scss',
})
export class DecideCSVDialogComponent extends CsvRootDialogComponent {
  icons = icons
  override getState(): DialogState {
    return DialogState.CSV;
  }
}
