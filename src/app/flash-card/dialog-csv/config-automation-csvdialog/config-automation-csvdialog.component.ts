import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { catchError, throwError } from 'rxjs';
import { pinch } from '../../../../aparte/aparte.builder';
import { getCases } from '../../../../lib/regex';
import { TAB_NAMES } from '../../../../ressources/enums';
import { icons } from '../../../../ressources/icons';
import { CSVConfigT } from '../../../../ressources/types';
import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { SessionReaderHelperService } from '../../../services/session-reader-helper.service';
import {
  SESSION_KEYS,
  SessionService,
} from '../../../services/session.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';
import { automations } from './baseAutomation.json';

@Component({
  selector: 'app-config-automation-csvdialog',
  templateUrl: './config-automation-csvdialog.component.html',
  styleUrl: './config-automation-csvdialog.component.scss',
})
export class ConfigAutomationCSVDialogComponent
  extends CsvRootDialogComponent
  implements AfterViewInit
{
  icons = icons;
  configForm!: FormGroup;
  dataSource = new MatTableDataSource<FormGroup>([]);

  private _rows!: FormArray;
  editingIndex: number | null = null;

  displayedColumns = ['index', 'column', 'regex', 'actions'];

  get rowsControls() {
    return this._rows.controls;
  }
  get newRowForm(): FormGroup {
    return this.configForm.get('newRow') as FormGroup<any>;
  }

  get rawTableData() {
    return this._rows.getRawValue();
  }

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private fb: FormBuilder,
    private sessionServ: SessionService,
    private sessionHelper: SessionReaderHelperService,
    protected override events: EventService,
    navService: DialogNavigationService
  ) {
    super(events, navService);
    this.configForm = this.fb.group({
      rows: this.fb.array([]),
      newRow: this.fb.group({
        column: [''],
        regex: [''],
        isSystem: [false],
      }),
    });

    this._rows = this.configForm.get('rows') as FormArray;
  }
  ngAfterViewInit(): void {
    this.subscribe(
      this.sessionServ
        .getSess(SESSION_KEYS.TRANSLATIONS)
        .pipe(catchError(this.handleAutomationLoadingError))
        .subscribe((data) => {
          const config = this.sessionHelper.putAutomationSession(
            data,
            automations
          );
          
          config.automations.list.forEach(({ column, regex, isSystem }) => {
            this.addRow({
              column,
              regex,
              isSystem,
            });
          });
          this.updateDataSource();
        })
    );
  }
  override getState(): DialogState {
    return DialogState.CONFIG_AUTOMATION;
  }

  handleAutomationLoadingError(err: any) {
    return throwError(
      () =>
        new Error(
          'Cannot retrieve data from the session. Please try again later.'
        )
    );
  }
  applyConfig() {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        const config: CSVConfigT = data as any;
        config.automations.list = this._rows.getRawValue();
        this.sessionServ.setSess(SESSION_KEYS.TRANSLATIONS, config);
      })
    );
  }

  goBack() {
    this.broadcast(pinch({ NAVIGATE: 'ui.dialog' }), DialogState.CONFIG);
    setTimeout(() => {
      this.broadcast(
        pinch({ PICK: 'ui.component.nav.tabs' }),
        TAB_NAMES.AUTOMATIONS
      );
    }, 100);
  }

  isNewRowFormSystem() {
    return this.newRowForm.get('isSystem')?.value;
  }

  hasCase(row: any) {
    return row.cases.length > 1;
  }

  getRowForm() {
    return this.fb.group({
      column: [''],
      regex: [''],
      hasCases: [false],
      isSystem: [false],
      cases: [[{ rule: '', value: '' }]],
    });
  }

  addRow(data?: { column: string; regex: string; isSystem: boolean }) {
    const value = data || this.newRowForm.value;
    const cases = getCases(value.regex);
    const hasCases = cases.length > 1;

    value.column = value.column.replaceAll(/!/g, '');
    const finalColumn = hasCases ? `!${value.column}` : value.column;
    const row = this.getRowForm();

    row.setValue({
      column: finalColumn,
      regex: value.regex,
      hasCases,
      isSystem: value.isSystem,
      cases,
    });

    this._rows.push(row);

    if (!data) {
      this.newRowForm.reset({
        column: '',
        regex: '',
        isSystem: false,
      });
    }
  }

  updateDataSource() {
    this.dataSource.data = this.rowsControls as FormGroup[];
    if (this.table) {
      this.table.renderRows();
    }
  }

  addOrUpdateRow() {
    const value = this.newRowForm.value;
    const cases = getCases(value.regex);
    const hasCases = cases.length > 1;

    const finalColumn = hasCases ? `!${value.column}` : value.column;
    const row = this.getRowForm();

    row.setValue({
      column: finalColumn,
      regex: value.regex,
      hasCases,
      isSystem: value.isSystem,
      cases,
    });
    const newRow = row;

    if (this.editingIndex !== null) {
      this._rows.setControl(this.editingIndex, newRow);
      this.editingIndex = null;
    } else {
      this._rows.push(newRow);
    }

    this.resetForm();
  }

  resetForm() {
    this.updateDataSource();
    this.newRowForm.reset({ column: '', regex: '' });
    this.editingIndex = null;
    this.switchEnable();
  }

  deleteRow(index: number) {
    this._rows.removeAt(index);
    this.updateDataSource();
    this.resetForm();
  }

  editRow(index: number) {
    const row = this._rows.at(index).value;
    const cleanColumn = row.column.startsWith('!')
      ? row.column.substring(1)
      : row.column;

    this.newRowForm.patchValue({
      column: cleanColumn,
      regex: row.regex,
      isSystem: row.isSystem,
    });

    this.editingIndex = index;
    this.switchEnable();
  }

  switchEnable() {
    const isDisabled = this.isNewRowFormSystem();

    ['column', 'regex'].forEach((e) => {
      const control = this.newRowForm.get(e);
      if (isDisabled) {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }
}
