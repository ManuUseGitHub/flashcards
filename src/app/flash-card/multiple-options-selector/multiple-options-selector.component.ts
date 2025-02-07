import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  faCircle,
  faCircleCheck,
  faFaceDizzy,
} from '@fortawesome/free-solid-svg-icons';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { SubscriberComponent } from '../../shared/subscriber/subscriber.component';

@Component({
  selector: 'app-multiple-options-selector',
  templateUrl: './multiple-options-selector.component.html',
  styleUrls: ['./multiple-options-selector.component.scss'],
  standalone: false,
})
export class MultipleOptionsSelectorComponent
  extends SubscriberComponent
  implements OnInit
{
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

  constructor(private events: EventService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.events.listen(EVENTS.LOADED_FILTERS, (data) => {
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
}
