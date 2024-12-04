import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlashCardFilterService } from '../services/flash-card-filter.service';
import { EventService } from '../../shared/event.service';
import { icons } from '../../../ressources/icons';
import { Router } from '@angular/router';
import { FlashCardPresetService } from '../services/flash-card-preset.service';
import { EVENTS } from '../../../ressources/enums';
import { Subscription } from 'rxjs';
import { CardEntry, EffectiveFilters } from '../../../ressources/types';
import { CardServiceService } from '../services/card-service.service';
import { makeCompleteList } from '../../listCompleter';
import { hasMatchingArtcicle } from '../../sorting/articlesSorting';
import { hasMatchingClassmentSelect } from '../../sorting/classmentSorting';
import { hasMatrchingText } from '../../sorting/containingSorting';
import {
  removeMatchingSelect,
  hasMultipleClassmentSelect,
} from '../../sorting/multiClassmentSorting';
import { hasMatchingType } from '../../sorting/typeSorting';
import { SortService } from '../../sort.service';
import { MatTableDataSource } from '@angular/material/table';

const MULTISELECT_HEADERS = ['themes', 'parts', 'chapters', 'tags', 'files'];

@Component({
  selector: 'app-flash-card-filter',
  templateUrl: './flash-card-filter.component.html',
  styleUrl: './flash-card-filter.component.scss',
  standalone: false,
})
export class FlashCardFilterComponent implements OnDestroy {
  services: Subscription[] = [];
  icons = icons;
  filterForm!: FormGroup;

  cards: CardEntry[] = [];
  difficultyStyles = ['BELLOW', 'BETWEEN', 'OVER'];
  difficulty = [];
  themes = [];
  types = [];
  files: string[] = [];
  articles = [];
  parts = [];
  chapters = [];
  tags = [];
  tagsSelected = 0;
  composedList: CardEntry[] = [];
  dataSource: MatTableDataSource<CardEntry>;

  get cardCount() {
    return this.composedList.length;
  }

  get tagesSelectedCount() {
    return this.tagsSelected;
  }
  courseSelected = 0;
  get courseSelectedCount() {
    return this.courseSelected;
  }
  wordsAndFiles = 0;
  get wordsAndFilesCount() {
    return this.wordsAndFiles;
  }

  selectedMultiples: { [x: string]: string[] } = {};

  saved = true;

  retrievedFilters: any = {};

  constructor(
    private fb: FormBuilder,
    private filterService: FlashCardFilterService,
    private events: EventService,
    private presets: FlashCardPresetService,
    private _router: Router,
    private cardService: CardServiceService,
    private sorter: SortService
  ) {
    this.dataSource = new MatTableDataSource<CardEntry>([]);
  }

  updateBadges() {
    const values = this.filterForm.getRawValue();
    this.tagsSelected = values.tags.length;
    this.courseSelected =
      values.themes.length + values.parts.length + values.chapters.length;

    this.wordsAndFiles =
      values.files.length +
      (values.article != '*' ? 1 : 0) +
      (values.type != '*' ? 1 : 0) +
      (values.containing && values.containing != '' ? 1 : 0);
  }
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromTo: [[]], // Pick what language you want to start with
      seed: [null], // Value for the RNG
      type: [[]], // Grammar grain picker
      containing: [null], // Search for words/expressions
      themes: [[]], // Themes picker
      article: [[]],
      files: [[]],
      parts: [[]], // Cursus-based knowledge blocks
      chapters: [[]], // Chapters-based knowledge blocks
      tags: [[]], // Fine-tuned categories
      difficultyStyle: [null], // Difficulty style
      difficultyLow: [[]],
      difficultyHigh: [[]],
      preset: [null],
    });
    this.cardService.getCards().subscribe((data: any) => {
      setTimeout(() => {
        this.cards = makeCompleteList(data);
        this.events.broadcast(EVENTS.DATASET_CHANGED.toString(), true);
      }, 0);
    });

    this.filterService.getCharacteristics().subscribe((data: any) => {
      this.events.broadcast(EVENTS.LOADED_FILTERS.toString(), data);
      this.articles = data.article;
      this.types = data.type;
      this.tags = data.tags;
      this.chapters = data.chapters;
      this.parts = data.parts;
      this.themes = data.themes;
      this.files = data.files;
      this.difficulty = data.difficulty;

      this.resetField();
      const retrievedFilters = sessionStorage.getItem('filters');

      this.applyConfiguration(retrievedFilters!);

      this.filterForm.valueChanges.subscribe((x) => {
        this.saved = false;
        this.events.broadcast(EVENTS.APPLY_FILTERS.toString(), x);

        this.updateBadges();
      });
    });

    this.services.push(
      ...[
        this.events.listen(EVENTS.LOADED_FILTERS.toString(), () => {
          setTimeout(() => {
            this.events.broadcast(
              EVENTS.APPLY_FILTERS.toString(),
              this.filterForm.value
            );
            this.updateBadges();
          }, 500);
        }),

        this.events.listen(EVENTS.LOAD_PRESET.toString(), (data) => {
          this.resetField();
          this.filterForm.patchValue({ preset: data.preset });
          this.applyConfiguration(JSON.stringify(data));
          this.updateBadges();
        }),

        this.events.listen(EVENTS.SAVE_FILTERS.toString(), (data) => {
          this.onSubmit();
        }),

        this.events.listen(
          EVENTS.APPLY_FILTERS.toString(),
          (filters: EffectiveFilters) => {
            this.composedList = this.cards.filter((e) =>
              this.sorter.sumTests(
                hasMatchingArtcicle(filters, e),
                hasMatchingType(filters, e),
                removeMatchingSelect(filters.files, 'file', e),
                hasMatchingClassmentSelect(filters.themes, 'theme', e),
                hasMatchingClassmentSelect(filters.chapters, 'chapter', e),
                hasMatchingClassmentSelect(filters.parts, 'part', e),
                hasMultipleClassmentSelect(filters.tags, 'tags', e),
                hasMatrchingText(filters, e)
              )
            );
          }
        ),
        this.events.listen(EVENTS.DEBUG.toString(), (data) => {
          console.log(data);
        }),
      ]
    );
  }

  compose() {}
  resetField() {
    MULTISELECT_HEADERS.forEach((s) => {
      this.selectedMultiples[s] = [];
    });
    this.filterForm.patchValue({
      type: '*',
      article: '*',
      fromTo: 'fr',
      difficultyLow: '*',
      difficultyHigh: '*',
      difficultyStyle: '*',
    });
  }
  applyConfiguration(retrievedFilters: string) {
    if (retrievedFilters) {
      this.events.broadcast(
        EVENTS.SESSION_FILTERS.toString(),
        retrievedFilters
      );
      //this.filterForm.patchValue(JSON.parse(retrievedFilters));

      MULTISELECT_HEADERS.forEach((s) => {
        this.selectedMultiples[s] = JSON.parse(retrievedFilters)[s];
      });

      this.filterForm.patchValue(JSON.parse(retrievedFilters));
    } else {
      this.events.broadcast(
        EVENTS.SESSION_FILTERS.toString(),
        this.filterForm.value
      );
    }
  }

  onToggleForMultiple(name: string, event: string[]) {
    const toPatch: { [k: string]: string[] } = {};
    toPatch[name] = event;
    this.filterForm.patchValue(toPatch);
  }

  toggleLanguage(event: string) {
    this.filterForm.patchValue({
      fromTo: event,
    });
  }

  onSubmit() {
    this.dataSave();
    this.saved = true;
  }

  onFileRead(event: string[]) {
    this.resetField();
    this.applyConfiguration(event[0]);
    //sessionStorage.setItem('filters', event);
  }

  savePreset() {
    this.presets
      .createPreset(this.filterForm.value)
      .subscribe((data: any) => {});
  }

  dataSave() {
    const copy = { ...this.filterForm.value };
    delete copy['preset'];
    sessionStorage.setItem('filters', JSON.stringify(copy));
  }

  goToPractice() {
    this._router.navigateByUrl('/cards');
  }

  scanCategories() {
    this.filterService.update().subscribe((data: any) => {});
  }

  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
