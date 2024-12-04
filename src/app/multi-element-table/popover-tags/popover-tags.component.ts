import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FlashCardFilterService } from '../../flash-card/services/flash-card-filter.service';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { introducedValue } from '../../../lib/strings';

@Component({
  selector: 'app-popover-tags',
  templateUrl: './popover-tags.component.html',
  styleUrl: './popover-tags.component.scss',
  standalone:false
})
export class PopoverTagsComponent implements AfterViewInit {
  @Input() row!: any;
  @Input() i!: any;
  @Input()
  selectedMultiples!: { [x: string]: string[] }[];

  tags = [];

  constructor(
    private filterService: FlashCardFilterService,
    private events: EventService
  ) {}

  ngAfterViewInit(): void {
    this.filterService.getCharacteristics().subscribe((data: any) => {
      this.events.broadcast(EVENTS.LOADED_FILTERS.toString(), data);
      this.tags = data.tags;
    });
  }
  getTags(row: any, i: number) {
    const spreaded = i;
    const newTags = `${row.controls.tags.value || ''}`.split(',');
    const result = [...this.selectedMultiples[spreaded]['tags'], ...newTags]
      .filter((x: string) => x)
      .sort()
      .map((x: string) => {
        return introducedValue('', x, this.tags);
      });
    return result;
  }
  onToggleForMultiple(key: number, data: string[]) {
    this.selectedMultiples[key]['tags'] = [...data];
  }
}
