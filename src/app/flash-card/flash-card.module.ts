import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashCardComponent } from './flash-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { FlashCardFilterComponent } from './flash-card-filter/flash-card-filter.component';
import { MultipleOptionsSelectorComponent } from './multiple-options-selector/multiple-options-selector.component';
import { BornSelectorComponent } from './born-selector/born-selector.component';
import { FormSelectorNaComponent } from './form-selector-na/form-selector-na.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CardsDataTableComponent } from './cards-data-table/cards-data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EditEntityComponent } from '../edit-entity/edit-entity.component';
import { MultiElementTableComponent } from '../multi-element-table/multi-element-table.component';
import { PopoverFileComponent } from '../multi-element-table/popover-file/popover-file.component';
import { PopoverFrenchComponent } from '../multi-element-table/popover-french/popover-french.component';
import { PopoverDutchComponent } from '../multi-element-table/popover-dutch/popover-dutch.component';
import { PopoverAnalysisComponent } from '../multi-element-table/popover-analysis/popover-analysis.component';
import { PopoverCourseComponent } from '../multi-element-table/popover-course/popover-course.component';
import { PopoverTagsComponent } from '../multi-element-table/popover-tags/popover-tags.component';
import { DialogCSVComponent } from '../multi-element-table/dialog-csv/dialog-csv.component';
import { FilteredTableDialogButtonComponent } from './flash-card-filter/filtered-table-dialog-button/filtered-table-dialog-button.component';

@NgModule({
  declarations: [
    FlashCardComponent,
    FlashCardFilterComponent,
    FormSelectorNaComponent,
    LanguageToggleComponent,
    MultipleOptionsSelectorComponent,
    BornSelectorComponent,
    CardsDataTableComponent,
    EditEntityComponent,
    MultiElementTableComponent,
    PopoverFileComponent,
    PopoverFrenchComponent,
    PopoverDutchComponent,
    PopoverAnalysisComponent,
    PopoverCourseComponent,
    PopoverTagsComponent,
    DialogCSVComponent,
    FilteredTableDialogButtonComponent,
  ],
  imports: [
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    SharedModule,
    MatSortModule,
  ],
  exports: [
    MultiElementTableComponent,
    EditEntityComponent,
    FlashCardComponent,
    FlashCardFilterComponent,
    MultipleOptionsSelectorComponent,
    PopoverFileComponent,
    PopoverFrenchComponent,
    PopoverDutchComponent,
    PopoverAnalysisComponent,
    PopoverCourseComponent,
    PopoverTagsComponent,
    DialogCSVComponent,
    FilteredTableDialogButtonComponent,
  ],
})
export class FlashCardModule {}
