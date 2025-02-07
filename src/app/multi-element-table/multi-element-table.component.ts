import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { icons } from '../../ressources/icons';
import { MatTableDataSource } from '@angular/material/table';
import { v4 } from 'uuid';
import { FlashCardFilterService } from '../flash-card/services/flash-card-filter.service';
import { EVENTS } from '../../ressources/enums';
import { EventService } from '../shared/event.service';
import { removeDuplicates } from '../../listUtils';
import { FieldEscapeCloser } from '../shared/filedEscapCloser';
import { MatPaginator } from '@angular/material/paginator';
import { CardServiceService } from '../flash-card/services/card-service.service';
import { FormRowtype } from '../../ressources/types';
import { makeTabbedCSV } from '../../lib/strings';
import { parsePadDirection } from '../../lib/enums';
import { SubscriberComponent } from '../shared/subscriber/subscriber.component';

@Component({
  selector: 'app-multi-element-table',
  templateUrl: './multi-element-table.component.html',
  styleUrls: ['./multi-element-table.component.scss'],
  standalone: false,
})
export class MultiElementTableComponent
  extends SubscriberComponent
  implements OnInit
{
  globalForm!: FormGroup;
  csvForm!: FormGroup;
  tableForm: FormGroup;
  dataSource: MatTableDataSource<any>;

  actions = [];
  all = [false];
  selectedMultiples: { [x: string]: string[] }[] = [];

  icons = icons;
  closer: FieldEscapeCloser;
  pageIndex = 0;
  pageSize = 0;
  private _csvContent: string = '';

  articles = [];
  files = [];
  types = [];
  themes = [];
  parts = [];
  chapters = [];
  tags = [];
  difficulties = [];

  get checkedRows() {
    return this.checkTemp.filter((x) => x);
  }

  get allSelected() {
    return this._allSelected;
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  _allSelected = false;
  _courses: string[] = [];
  checkTemp: boolean[] = [];
  get courses() {
    return this._courses.join('/');
  }

  displayedColumns: string[] = [
    'actions',
    'french',
    'dutch',
    'analysis',
    'course',
    'tags',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private filterService: FlashCardFilterService,
    private events: EventService,
    private cards: CardServiceService
  ) {
    super();
    this.closer = new FieldEscapeCloser(events);
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
    });
    this.dataSource = new MatTableDataSource(this.rows.controls);
    this.globalForm = this.fb.group({
      all: [false],
      file: [''],
    });
    this.csvForm = this.fb.group({
      csv: [''],
      padding: [''],
    });
    this.tableForm.valueChanges.subscribe((data) => {
      this.updateTable();
    });
    this.globalForm.valueChanges.subscribe((data) => {
      this.updateTable();
    });
    // Voeg een initiële rij toe
  }
  @HostListener('document:click', ['$event'])
  onClick(event: any): void {
    (event as PointerEvent).stopImmediatePropagation();
    const classList: string[] = event.target.classList || [];

    this.closePopover({
      event,
      canClose:
        -1 ==
        Object.values(classList).findIndex((x) => /^mdc-list-item/.test(x)),
    });
  }
  @HostListener('document:keydown.escape', ['$event']) handleKeyEvent(
    event: KeyboardEvent
  ): void {
    this.closer.handleKey(event);
  }
  setCharacteristics(data: any) {
    this.files = data.files;
    this.articles = data.article;
    this.types = data.type;
    this.themes = data.themes;
    this.parts = data.parts;
    this.chapters = data.chapters;
    this.tags = data.tags;
    this.difficulties = data.difficulty;
  }
  ngOnInit(): void {
    this.filterService.getCharacteristics().subscribe((data: any) => {
      this.setCharacteristics(data);
      this.dataSource.paginator = this.paginator;

      this.csvForm.patchValue({ padding: 'center' });
      this.csvForm.controls['padding'].valueChanges.subscribe((data) => {
        this.patchNewCSVView(this._csvContent);
      });
    });
    this.subscribe(
      this.events.listen(EVENTS.FOCUS_NEXT, (event) => {
        this.focusNext();
      }),
      this.events.listen(EVENTS.PATCH_CSV, (event) => {
        this._csvContent = event;
        this.patchNewCSVView(event);
      }),
      this.events.listen(EVENTS.ADDED_ROW, (event) => {
        this.addRow(event);
      }),
      this.events.listen(EVENTS.DEBUG, (data) => {
        console.log(data);
      })
    );
  }

  focusNext() {
    // Retrieve all focusable elements on the page
    const focusableElements = Array.from(
      document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    // Find the currently focused element
    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    // Get the next element (wrap around to the beginning if at the last element)
    const nextElement =
      focusableElements[(currentIndex + 1) % focusableElements.length];

    // Trigger focus on the next element
    if (nextElement) {
      nextElement.focus();
    }
  }

  onToggleForMultiple(key: number, data: string[]) {
    this.selectedMultiples[key]['tags'] = [...data];
  }
  getControlsAt(key: number): any {
    return (this.rows.controls[key] as FormGroup).controls;
  }
  getControlAt(key: number, name: string): any {
    return this.getControlsAt(key)[name];
  }

  // Functie om een nieuwe rij toe te voegen aan de FormArray
  addRow(entry: any = {}) {
    console.log(entry);
    const row = this.fb.group({
      actions: [false],
      id: [entry.id || v4()],
      tags: [entry.tags || ''],
      type: [entry.type],
      date: [entry.date || new Date()],
      difficulty: [entry.difficulty || -1],
      article: [entry.article],
      dutch: [entry.dutch],
      french: [entry.french],
      theme: [entry.theme],
      issuer: [''],
      chapter: [entry.chapter],
      part: [entry.part],
    });

    this.rows.push(row);
    this.selectedMultiples.push({ tags: [] });
    this.checkTemp.push(false);

    this.patchRow(this.selectedMultiples.length - 1, {
      actions: this._allSelected,
    });
  }

  deleteRows() {
    const idsMatch = this.checkTemp
      .map((x, i) => ({ value: x, index: i }))
      .filter((x) => x.value);

    idsMatch
      .sort((a, b) => (a.index < b.index ? 1 : -1))
      .forEach((e) => {
        this.deleteRow(e.index);
        this.pageIndex--;
      });
    setTimeout(() => {
      this.pageIndex = this.paginator.pageIndex;
    }, 100);
  }

  deleteRow(spreaded: number) {
    this.rows.removeAt(spreaded);
    this.selectedMultiples = this.selectedMultiples.filter((x, i) => {
      return i != spreaded;
    });

    this.checkTemp = this.checkTemp.filter((x, i) => spreaded != i);

    this.updateTable();
  }

  updateTable() {
    this.dataSource.data = this.rows.controls;
  }

  onSaveChanges() {
    if (this.tableForm.valid) {
      const copy = [...this.tableForm.value.rows].map((x, i) => {
        console.log(this.getControlAt(i, 'tags').value);
        const fromInput = this.getControlAt(i, 'tags')
          .value.split(',')
          .filter((x: string) => x);
        x.tags = removeDuplicates([
          ...fromInput,
          ...this.selectedMultiples[i]['tags'],
        ]);
        return x;
      });

      this.cards.add({
        global: this.globalForm.getRawValue(),
        rows: copy,
      });
    }
  }

  getSpreadedIndex(i: number) {
    return this.pageIndex * this.pageSize + i;
  }

  getRowsAsArray() {
    return this.rows.controls as FormGroup[];
  }

  inverseSelection() {
    let i = 0;
    let t = this.rows.length;
    for (; i < t; ++i) {
      const spreaded = this.getSpreadedIndex(i);
      this.patchRow(spreaded, { actions: !this.checkTemp[spreaded] });
    }
  }

  onCheckAll(event: any) {
    this._allSelected = this.globalForm.controls['all'].value;
    const rows = this.getRowsAsArray();
    this.setAllRawActionsTo(rows, this._allSelected);
  }

  patchRow(i: number, patchObject: any) {
    if ('actions' in (patchObject as FormRowtype)) {
      this.checkTemp[i] = patchObject.actions;
    }

    this.getRowsAsArray()[i].patchValue(patchObject);
  }
  patchNewCSVView(_csvContent: string) {
    const paddingDirection = this.csvForm.controls['padding'].getRawValue();
    this.csvForm.patchValue({
      csv: makeTabbedCSV(this._csvContent, parsePadDirection(paddingDirection)),
    });
  }

  saveValue(event: any, i: number) {
    const spreaded = this.getSpreadedIndex(i);
    const rows = this.getRowsAsArray();
    if (this._allSelected) {
      this._allSelected = false;
      this.setAllRawActionsTo(rows, true);
      this.checkTemp[spreaded] = false;
      this.globalForm.patchValue({ all: false });
    } else {
      this.checkTemp[spreaded] = rows[spreaded].get('actions')!.value;
    }
  }
  setAllRawActionsTo(rows: FormGroup<any>[], value: boolean) {
    rows.forEach((check, i) => {
      check.patchValue({ actions: value });
      this.checkTemp[i] = value;
    });
  }

  closePopover(event: { event: any; canClose: boolean }) {
    this.events.broadcast(EVENTS.LOST_FOCUS, event);
  }

  setFocusDirection(event: any) {
    if (event.shiftKey || event.key == 'Shift') {
      this.events.broadcast(EVENTS.TAB_DIRECTION, {
        event,
        canClose: false,
      });
    }
  }

  onRowClick(row: any) {
    this.events.broadcast(EVENTS.LOAD_CARD, row);
  }

  onPageChanged(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
