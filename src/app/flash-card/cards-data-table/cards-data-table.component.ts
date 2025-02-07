import {
  AfterViewInit,
  Component,
  Inject,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardEntry, FormRowtype } from '../../../ressources/types';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { icons } from '../../../ressources/icons';
import { SubscriberComponent } from '../../shared/subscriber/subscriber.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cards-data-table',
  templateUrl: './cards-data-table.component.html',
  styleUrl: './cards-data-table.component.scss',
  standalone: false,
})
export class CardsDataTableComponent
  extends SubscriberComponent
  implements OnInit
{
  @Input()
  dataSource!: MatTableDataSource<CardEntry>;

  @Input()
  cards!: CardEntry[];

  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  icons = icons;
  displayedColumns: string[] = [
    'all',
    'dutch',
    'french',
    'type',
    'course',
    'tags',
    'referal',
    'difficulty',
    'flags',
  ];
  checkHeaders!: string[];

  _allSelected = false;
  _courses: string[] = [];
  checkTemp: boolean[] = [];

  pageIndex = 0;
  pageSize = 0;

  actions = [];
  all = [false];
  selectedMultiples: { [x: string]: string[] }[] = [];

  tableForm: FormGroup;
  dataSourceCopy?: string;

  get allSelected() {
    return this._allSelected;
  }
  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  constructor(
    private events: EventService,
    @Inject(FormBuilder) private fb: FormBuilder
  ) {
    super();
    this.checkHeaders = this.displayedColumns.map((x) => x + '-th');
    this.tableForm = this.fb.group({
      rows: this.fb.array(new Array<{ actions: boolean }>()),
      all: [false], // "Select All" checkbox
    });
    this.tableForm.valueChanges.subscribe((data) => {
      this.refreshTable();
    });
  }
  getHeaderCheckName(name: string): number {
    return this.checkHeaders.indexOf(name + '-th');
  }
  getCastedRow(i: number) {
    return this.rows.at(i) as FormControl;
  }
  colorStyle(element: CardEntry) {
    if (!element.article) {
      return '';
    }
    const m = /^(?<article>het|de)/.exec(element.article)!;
    const { article } = m.groups!;
    return article + '-art-color';
  }

  flagClass(
    element: CardEntry,
    field: 'unverified' | 'forAttention' | 'forModification'
  ) {
    const test = element[field];
    if (test) {
      switch (field) {
        case 'unverified':
          return 'text-green-600';
        case 'forAttention':
        case 'forModification':
          return 'text-orange-600';
      }
    }
    return '';
  }

  toggleAllRows(event: any): void {
    const isChecked = event.checked;
    this.rows.controls.forEach((control, i) =>
      this.patchRow(i, {
        actions: isChecked,
      })
    );
    console.log(this.rows);
  }

  saveValue(event: any, i: number) {
    const spreaded = this.getSpreadedIndex(i);
    const rows = this.getRowsAsArray();
    if (this._allSelected) {
      this._allSelected = false;
      this.setAllRawActionsTo(rows, true);
      this.checkTemp[spreaded] = false;
    } else {
      this.checkTemp[spreaded] = !this.checkTemp[spreaded];
    }
    console.log(this.rows.getRawValue());
    this.tableForm.patchValue({ all: false });

    this.refreshTable(true);
  }

  getSpreadedIndex(i: number) {
    return this.pageIndex * this.pageSize + i;
  }

  getRowsAsArray() {
    class T {
      actions!: FormControl<boolean>;
    }
    const list: FormGroup<T>[] = this.rows.controls as FormGroup<T>[];
    return list;
  }

  setAllRawActionsTo(rows: FormGroup<any>[], value: boolean) {
    rows.forEach((check, i) => {
      check.patchValue({ actions: value });
      this.checkTemp[i] = value;
    });
  }

  addRow(entry: any = {}) {
    const row = this.fb.group({
      actions: [false],
    });

    this.rows.push(row);
    this.selectedMultiples.push({ tags: [] });
    this.checkTemp.push(false);

    this.patchRow(this.selectedMultiples.length - 1, {
      actions: this._allSelected,
    });
  }

  patchRow(i: number, patchObject: any) {
    if ('actions' in (patchObject as FormRowtype)) {
      this.checkTemp[i] = patchObject.actions;
    }

    this.getRowsAsArray()[i].patchValue(patchObject);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<CardEntry>(this.cards);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.checkTemp = new Array(this.cards.length).fill(false);
    this.updateFormArray(true);

    /**/
  }

  onCheckAll(event: any) {}

  // TODO: implement for one button click and prevent on check box or special control from triggering
  onRowClick(row: any) {
    this.events.broadcast(EVENTS.LOAD_CARD, row);
  }

  refreshTable(force = false) {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<CardEntry>(this.cards);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.updateFormArray(force);
    }, 500);
  }

  private updateFormArray(force = false) {
    const copy = JSON.stringify(this.rows.getRawValue());
    if (force || copy !== this.dataSourceCopy) {
      const rowsArray = this.rows;
      rowsArray.clear(); // Clear old data
      this.cards.forEach((e, i) =>
        rowsArray.push(this.fb.control(this.checkTemp[i]))
      ); // Create new controls

      this.dataSourceCopy = copy;
      console.log('refreshed');
    }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChanged(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
