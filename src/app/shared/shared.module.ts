import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { JsonDataDownloadComponent } from './json-data-download/json-data-download.component';
import { HrTitledComponent } from '../hr-titled/hr-titled.component';
import { SurpriseButtonGroupComponent } from './surprise-button-group/surprise-button-group.component';
import { PopoverWithHTMLComponent } from './popover-with-html/popover-with-html.component';
import { MatTableModule } from '@angular/material/table';
import { WordCloudedPipe } from './pipes/word-clouded.pipe';
import { FlnlModalComponent } from './flnl-modal/flnl-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DynamicDialogComponent } from './flnl-modal/dynamic-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CardsComponent } from './icons/cards.component';
import { CsvEditableLinesPipe } from './pipes/csv-editable-lines.pipe';
import { AlSlashComponent } from './icons/alSlash.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    JsonDataDownloadComponent,
    HrTitledComponent,
    SurpriseButtonGroupComponent,
    PopoverWithHTMLComponent,
    AutoCompleteComponent,
    WordCloudedPipe,
    FlnlModalComponent,
    DynamicDialogComponent,
    CardsComponent,
    AlSlashComponent,
    CsvEditableLinesPipe,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatProgressBarModule,
    AutoCompleteComponent,
    FileUploadComponent,
    JsonDataDownloadComponent,
    HrTitledComponent,
    SurpriseButtonGroupComponent,
    PopoverWithHTMLComponent,
    WordCloudedPipe,
    CsvEditableLinesPipe,
    FlnlModalComponent,
    DynamicDialogComponent,
    CardsComponent,
    AlSlashComponent,
  ],
})
export class SharedModule {}
