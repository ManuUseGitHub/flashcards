import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import {
  faCircle,
  faCircleCheck,
  faFaceDizzy,
} from '@fortawesome/free-solid-svg-icons';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multiple-options-selector',
  templateUrl: './multiple-options-selector.component.html',
  styleUrls: ['./multiple-options-selector.component.scss'],
  standalone: false,
})
export class MultipleOptionsSelectorComponent implements OnInit, OnDestroy {
  services: Subscription[] = [];

  // Input to receive tags from the parent component
  @Input()
  options: string[] = [];

  filters: any = null;
  @Input() intro!: string;

  @Input() filterKey!: string;

  // Output event to emit selected tags to the parent component
  @Output() selectionChange = new EventEmitter<string[]>();

  // To keep track of selected tags
  @Input() selectedTags: string[] = [];

  faCircleCheck = faCircleCheck;
  faCircle = faCircle;
  faFaceDizzy = faFaceDizzy;
  focused = '';
  hover = '';

  constructor(private events: EventService) {}

  ngOnInit(): void {
    this.services.push(
      this.events.listen(EVENTS.LOADED_FILTERS.toString(), (data) => {
        this.options = data[this.filterKey];
      })
    );
  }

  setIsFocused(focused: boolean, option: string) {
    if (!focused) {
      this.focused = '';
    } else {
      this.focused = option;
    }
  }

  setIsHover(hover: boolean, option: string) {
    if (!hover) {
      this.hover = '';
    } else {
      this.hover = option;
    }
  }

  // Toggle selection
  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(
        (selectedTag) => selectedTag !== tag
      );
    } else {
      this.selectedTags.push(tag);
    }
    this.selectionChange.emit(this.selectedTags);
  }

  // Check if tag is selected
  isSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }

  isFocused(tag: string): boolean {
    return this.focused == tag;
  }

  isHover(tag: string): boolean {
    return this.hover == tag;
  }
  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
