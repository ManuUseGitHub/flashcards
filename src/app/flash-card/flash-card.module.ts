import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { EditEntityComponent } from "../edit-entity/edit-entity.component";
import { LanguageToggleComponent } from "../language-toggle/language-toggle.component";
import { DialogCSVComponent } from "../multi-element-table/dialog-csv/dialog-csv.component";
import { MultiElementTableComponent } from "../multi-element-table/multi-element-table.component";
import { PopoverAnalysisComponent } from "../multi-element-table/popover-analysis/popover-analysis.component";
import { PopoverCourseComponent } from "../multi-element-table/popover-course/popover-course.component";
import { PopoverDutchComponent } from "../multi-element-table/popover-dutch/popover-dutch.component";
import { PopoverFileComponent } from "../multi-element-table/popover-file/popover-file.component";
import { PopoverFrenchComponent } from "../multi-element-table/popover-french/popover-french.component";
import { PopoverTagsComponent } from "../multi-element-table/popover-tags/popover-tags.component";
import { SharedModule } from "../shared/shared.module";
import { BornSelectorComponent } from "./born-selector/born-selector.component";
import { CardsDataTableComponent } from "./cards-data-table/cards-data-table.component";
import { FilteredTableDialogButtonComponent } from "./flash-card-filter/filtered-table-dialog-button/filtered-table-dialog-button.component";
import { FlashCardFilterComponent } from "./flash-card-filter/flash-card-filter.component";
import { FlashCardComponent } from "./flash-card.component";
import { FormSelectorNaComponent } from "./form-selector-na/form-selector-na.component";
import { MultipleOptionsSelectorComponent } from "./multiple-options-selector/multiple-options-selector.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    SharedModule,
    MatSortModule,
    BrowserAnimationsModule,
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
