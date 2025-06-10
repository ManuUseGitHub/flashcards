import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { parse } from 'csv-parse/browser/esm';
import { hi5, nod, touch } from '../../../../aparte/aparte.builder';
import {
  htmlToCsv,
  isCsvValide,
  makeTabbedCSV,
  mergeCSVs,
  removePadding,
  trimCSVValues,
} from '../../../../lib/strings';
import { parsePadDirection } from '../../../../ressources/enums';
import { icons } from '../../../../ressources/icons';
import { FormRowtype } from '../../../../ressources/types';
import { INCLUSIVE_MARK } from '../../../../ressources/values';
import { onReadingRow } from '../../../business/csvHelper';
import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';

const REQUIRED_HEADERS = ['dutch', 'french'];

@Component({
  selector: 'app-file-csvdialog',
  templateUrl: './file-csvdialog.component.html',
  styleUrl: './file-csvdialog.component.scss',
})
export class FileCSVDialogComponent extends CsvRootDialogComponent {
  icons = icons;
  private _loadingFromCSV = false;
  private _csvContent: string = '';
  private _lineCount = 0;
  csvForm!: FormGroup;
  csvDirections = ['left', 'center', 'right'];
  timer: any;
  validity: { valid: boolean; lines: number[] } = { valid: true, lines: [] };
  override getState(): DialogState {
    return DialogState.FILE;
  }

  private _csvBody = '';
  get csvBody() {
    return this.validity.valid ? this.csvEditable : this._csvBody;
  }

  get csvEditable() {
    return this.csvForm.controls['csv'].getRawValue();
  }
  get isLoadingFromCSV() {
    return this._loadingFromCSV;
  }

  get linesCount() {
    return this._lineCount;
  }

  constructor(
    @Inject(FormBuilder) protected fb: FormBuilder,
    protected override events: EventService,
    protected override navService: DialogNavigationService
  ) {
    super(events, navService);
    this.listenDoing({ PATCH_CSV_CONTENT: 'data' }, (event: string) => {
      //this.patchNewCSVView(event);
      this.broadcast(
        hi5({ PATCH_CSV_CONTENT: 'data' }),
        event.split('\n').length - 1
      );
    });
    this.listenSatisfied({ PATCH_CSV_CONTENT: 'data' }, (count: number) => {
      this._lineCount = count;
    });
    this.listenDoing({FILE:'data.download'},(fileContent)=> {
      const csv = fileContent;
      this.onUploadFile([csv]);
      this.validity = isCsvValide(csv, REQUIRED_HEADERS);
    })
    const model = {
      csv: [''],
      padding: [''],
    };

    this.csvForm = this.fb.group(model);
    setTimeout(() => {
      this.broadcast(nod({ SET_CSV_FORM: 'ui.component.form' }), model);
    }, 500);
  }

  ngOnInit(): void {
    this.csvForm.patchValue({ padding: 'center' });
    this.csvForm.controls['padding'].valueChanges.subscribe((data) => {
      this.patchNewCSVView(this._csvContent);
    });
    setTimeout(() => {
      /*
      const csv = ``;
      this.onUploadFile([csv]);
      this.validity = isCsvValide(csv, REQUIRED_HEADERS);
      /**/
    }, 100);
  }

  onInput(event: any) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const newCsv =
      this.inputCSVHeaders.nativeElement.innerText + '\n' + this.getInputCsv();
    this.validity = isCsvValide(newCsv, REQUIRED_HEADERS);
    if (this.validity.valid) {
      this.timer = setTimeout(() => {
        this.onUploadFile([newCsv]);
      }, 1000);
    } else {
      this._csvBody = makeTabbedCSV(
        newCsv,
        parsePadDirection(this.csvForm.controls['padding'].getRawValue())
      );
    }
  }

  getInputCsv = () => {
    return trimCSVValues(htmlToCsv(this.inputCSVLines.nativeElement.innerText));
  };

  importFromCSVContent() {
    const filecontent: string = this.csvForm.controls['csv'].getRawValue();
    const csvData: FormRowtype[] = [];
    const headers = {};

    let count = 0;

    const trimmed = removePadding(trimCSVValues(filecontent, true));
    parse(trimmed, { delimiter: ';' })
      .on('data', (data: any) => onReadingRow(data, count++, headers, csvData))
      .on('end', () => {
        this._loadingFromCSV = true;
        const normalizedSpaces: FormRowtype[] = JSON.parse(
          JSON.stringify(csvData).replaceAll(/\s/g, ' ')
        );
        setTimeout(() => {
          normalizedSpaces.forEach((x) => {
            this.broadcast(touch({ ADD_ROW: 'ui.component.table' }), x);
          });
          this._loadingFromCSV = false;
        }, 500);
      })
      .on('error', (err: any) => {
        console.error('Error parsing CSV:', err);
      });
  }

  patchNewCSVView(csv: string) {
    this.validity = isCsvValide(csv, REQUIRED_HEADERS);
    this._csvContent = csv;
    const paddingDirection = this.csvForm.controls['padding'].getRawValue();
    this.csvForm.patchValue({
      csv: makeTabbedCSV(csv, parsePadDirection(paddingDirection)),
    });
    this.broadcast(touch({ PATCH_CSV_CONTENT: 'data' }), csv);
  }

  onUploadFile(filecontents: string[]) {
    //console.log(filecontents.map((x) => x.split(/\r\n/)));
    this.patchNewCSVView(mergeCSVs(filecontents, REQUIRED_HEADERS));
  }

  setDisplayCsv(direction: string) {
    this.csvForm.patchValue({
      padding: direction == 'none' ? INCLUSIVE_MARK : direction,
    });
  }

  actualizeCsv() {
    const csv = this.csvForm.controls['csv'].getRawValue();
    this.patchNewCSVView(trimCSVValues(csv, true));
  }
}
