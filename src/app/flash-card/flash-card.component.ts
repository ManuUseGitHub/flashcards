import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { CardServiceService } from './services/card-service.service';
import { CardEntry, EffectiveFilters } from '../../ressources/types';
import { EventService } from '../shared/event.service';
import { makeCompleteList } from '../listCompleter';
import { SortService } from '../sort.service';
import { hasMatrchingText } from '../sorting/containingSorting';
import { hasMatchingArtcicle } from '../sorting/articlesSorting';
import { hasMatchingType } from '../sorting/typeSorting';
import { hasMatchingClassmentSelect } from '../sorting/classmentSorting';
import {
  hasMultipleClassmentSelect,
  removeMatchingSelect,
} from '../sorting/multiClassmentSorting';
import { Router } from '@angular/router';
import { icons } from '../../ressources/icons';
import { EVENTS } from '../../ressources/enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flash-card.component.html',
  styleUrls: ['./flash-card.component.scss'],
  standalone: false,
})
export class FlashCardComponent implements OnInit, OnDestroy {
  services: Subscription[] = [];
  filters!: any;
  constructor(
    private cardService: CardServiceService,
    private events: EventService,
    private sorter: SortService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.cardService.getCards().subscribe((data: any) => {
      setTimeout(() => {
        this.cards = makeCompleteList(data);
        this.filters = sessionStorage.getItem('filters')!;
      }, 100);
      setTimeout(() => {
        this.events.broadcast(
          EVENTS.APPLY_FILTERS.toString(),
          JSON.parse(this.filters)
        );
      }, 500);
    });

    this.services.push(
      this.events.listen(
        EVENTS.APPLY_FILTERS.toString(),
        (filters: EffectiveFilters) => {
          console.log(filters);
          this.composedList = this.cards.filter((e) =>
            this.sorter.sumTests(
              hasMatrchingText(filters, e),
              hasMatchingArtcicle(filters, e),
              hasMatchingType(filters, e),
              removeMatchingSelect(filters.files, 'file', e),
              hasMatchingClassmentSelect(filters.themes, 'theme', e),
              hasMatchingClassmentSelect(filters.chapters, 'chapter', e),
              hasMatchingClassmentSelect(filters.parts, 'part', e),
              hasMultipleClassmentSelect(filters.tags, 'tags', e)
            )
          );

          this.isFromDutch = filters.fromTo == 'nl';
          this.shuffle();
          //this.refreshTable();
        }
      )
    );
  }

  isFlipped = false;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  icons = icons;
  sample = 1;
  challangeIndex = 0;
  score = 0;
  isFromDutch = true;
  composedList: CardEntry[] = [];
  cards: CardEntry[] = [];

  get progress() {
    return `${this.challangeIndex + 1}/${this.composedList.length}`;
  }

  compose() {
    //this.composedList = [...this.cards];
    /*Object.entries(this.cards).map((x: [string, CardEntry[]]) => {
      const [key, entries] = x;
      const t = entries.length;
      const randomIndex = Math.floor(Math.random() * t);
      const sample = this.takeSampleAmount(t, this.sample);

      for (let i = 0; i < sample; i++) {
        const sampledIndex = (randomIndex + i) % t;
        this.composedList.push(entries[sampledIndex]);
      }
    });
    this.composedList.forEach((e) => {
      //console.log(e);
    });*/
  }

  shuffle() {
    const array = this.composedList;
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  takeSampleAmount(t: number, sample: number): any {
    return t - sample > 0 ? sample : t;
  }

  // Flip card function
  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  // Navigate to the previous card
  prevCard() {
    console.log('Previous card');
    // Logic to go to the previous card
  }

  win() {
    this.nextCard();
    this.score++;
  }

  lose() {
    this.nextCard();
  }

  skip() {
    this.nextCard();
  }

  goBack() {
    this._router.navigateByUrl('/');
  }

  // Navigate to the next card
  nextCard() {
    if (this.isFlipped) {
      this.flipCard();
      setTimeout(() => {
        this.challangeIndex++;
      }, 300);
    } else {
      this.challangeIndex++;
    }

    // Logic to go to the next card
  }

  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
