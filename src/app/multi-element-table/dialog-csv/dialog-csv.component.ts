import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormRowtype } from '../../../ressources/types';

import { parse } from 'csv-parse/browser/esm';
import { onReadingRow } from '../../../ressources/csvHelper';
import {
  htmlToCsv,
  isCsvValide,
  makeTabbedCSV,
  mergeCSVs,
  removePadding,
  trimCSVValues,
} from '../../../lib/strings';
import { FormGroup } from '@angular/forms';
import { icons } from '../../../ressources/icons';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { parsePadDirection } from '../../../lib/enums';

const REQUIRED_HEADERS = ['dutch', 'french'];

@Component({
  selector: 'app-dialog-csv',
  templateUrl: './dialog-csv.component.html',
  styleUrl: './dialog-csv.component.scss',
  standalone: false,
})
export class DialogCSVComponent implements OnInit {
  icons = icons;
  _loadingFromCSV = false;
  _csvContent: string = '';
  csvDirections = ['left', 'center', 'right'];
  timer: any;
  validity: { valid: boolean; lines: number[] } = { valid: true, lines: [] };

  @Input() csvForm!: FormGroup;

  @ViewChild('contentDiv') csvDiv!: ElementRef;
  @ViewChild('inputCSVHeaders') inputCSVHeaders!: ElementRef;
  @ViewChild('inputCSVLines') inputCSVLines!: ElementRef;

  _csvBody = '';
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
    return this.inputCSVLines?.nativeElement.innerText.split('\n').length;
  }

  constructor(private events: EventService) {}
  ngOnInit(): void {
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

    const trimmed = removePadding(trimCSVValues(filecontent));
    parse(trimmed, { delimiter: ';' })
      .on('data', (data: any) => onReadingRow(data, count++, headers, csvData))
      .on('end', () => {
        this._loadingFromCSV = true;
        setTimeout(() => {
          csvData.forEach((x) => {
            this.events.broadcast(EVENTS.ADDED_ROW.toString(), x);
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
    this.events.broadcast(EVENTS.PATCH_CSV.toString(), csv);
  }

  onUploadFile(filecontents: string[]) {
    this.patchNewCSVView(mergeCSVs(filecontents, REQUIRED_HEADERS));
  }

  setDisplayCsv(direction: string) {
    this.csvForm.patchValue({
      padding: direction == 'none' ? '*' : direction,
    });
  }

  actualizeCsv() {
    const csv = this.csvForm.controls['csv'].getRawValue();
    this.patchNewCSVView(trimCSVValues(csv));
  }
}
