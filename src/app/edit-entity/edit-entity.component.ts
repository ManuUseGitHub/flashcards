import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { icons } from '../../ressources/icons';
import { CardEntry } from '../../ressources/types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../shared/event.service';
import { EVENTS } from '../../ressources/enums';
import { CardServiceService } from '../flash-card/services/card-service.service';
import { modifyCardDAO } from '../flash-card/services/daos';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrl: './edit-entity.component.scss',
  standalone: false,
})
export class EditEntityComponent implements OnInit, OnDestroy {
  services: Subscription[] = [];

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private events: EventService,
    private cardService: CardServiceService
  ) {}
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

    this.services.push(
      this.events.listen(EVENTS.LOAD_CARD.toString(), (data) => {
        this.filterForm.patchValue(data);
      })
    );
  }
  @Input() entity?: CardEntry;

  icons = icons;

  onSubmit() {
    this.filterForm.patchValue({ date: new Date() });
    this.cardService.update(this.filterForm.getRawValue());
  }
  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
