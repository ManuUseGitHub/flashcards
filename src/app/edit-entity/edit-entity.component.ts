import { Component, Inject, Input, OnInit } from '@angular/core';
import { icons } from '../../ressources/icons';
import { CardEntry, CardModify } from '../../ressources/types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../shared/event.service';
import { EVENTS } from '../../ressources/enums';
import { CardServiceService } from '../flash-card/services/card-service.service';
import { modifyCardDAO } from '../flash-card/services/daos';
import { catchError, throwError } from 'rxjs';
import { SubscriberComponent } from '../shared/subscriber/subscriber.component';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrl: './edit-entity.component.scss',
  standalone: false,
})
export class EditEntityComponent extends SubscriberComponent implements OnInit {
  @Input() entity?: CardEntry;
  filterForm!: FormGroup;
  icons = icons;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private events: EventService,
    private cardService: CardServiceService
  ) {
    super();
  }
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      id: [null],
      type: [[]], // Grammar grain picker/ Search for words/expressions
      theme: [null], // Themes picker
      article: [null],
      dutch: [null],
      french: [null],
      date: [null],
      part: [null], // Cursus-based knowledge blocks
      chapter: [null], // Chapters-based knowledge blocks
      issuer: [null],
      tags: [[]], // Fine-tuned categories
      difficulty: [null],
    });

    this.subscribe(
      this.events.listen(EVENTS.LOAD_CARD, (data) => {
        this.filterForm.patchValue(data);
      }),
      this.events.listen(EVENTS.SAVE_CARD, (data) => {
        this.onSubmit();

        this.events.broadcast(EVENTS.LOAD_CARD, null);
      })
    );
  }
  onSubmit() {
    const changedData = {
      date: new Date(),
      ...this.filterForm.getRawValue(),
    };
    this.filterForm.patchValue(changedData);
    this.cardService
      .update(changedData)
      .pipe(
        catchError((error: any) => {
          return throwError(() => new Error('Something went wrong'));
        })
      )
      .subscribe((response) => {
        this.events.broadcast(EVENTS.SYNC_LOCAL_CARDS, {
          unverified: true,
          ...changedData,
        });
      });
  }
}
