import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CardEntry } from '../../../../ressources/types';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filtered-table-dialog-button',
  templateUrl: './filtered-table-dialog-button.component.html',
  styleUrl: './filtered-table-dialog-button.component.scss',
})
export class FilteredTableDialogButtonComponent {
  @Input()
  filterForm!: FormGroup;
  @Input()
  composedList!: CardEntry[];
  @Input()
  dataSource!: MatTableDataSource<CardEntry>;
}
