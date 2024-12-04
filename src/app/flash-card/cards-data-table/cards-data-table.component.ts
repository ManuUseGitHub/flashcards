import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardEntry } from '../../../ressources/types';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventService } from '../../shared/event.service';
import { EVENTS } from '../../../ressources/enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-data-table',
  templateUrl: './cards-data-table.component.html',
  styleUrl: './cards-data-table.component.scss',
  standalone: false,
})
export class CardsDataTableComponent implements OnInit, OnDestroy {
  services: Subscription[] = [];
  displayedColumns: string[] = [
    'dutch',
    'french',
    'type',
    'course',
    'tags',
    'referal',
    'difficulty',
  ];

  @Input()
  dataSource!: MatTableDataSource<CardEntry>;

  @Input()
  cards!: CardEntry[];
  
  private _liveAnnouncer = inject(LiveAnnouncer);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private events: EventService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.refreshTable();
    }, 500);
  }

  onRowClick(row: any) {
    this.events.broadcast(EVENTS.LOAD_CARD.toString(), row);
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource<CardEntry>(this.cards);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
