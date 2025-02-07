import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscriber',
  template: '',
  styleUrl: './subscriber.component.scss',
  standalone: false,
})
export class SubscriberComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  subscribe(...subscriptions: Subscription[]) {
    this.subscriptions.push(...subscriptions);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }
}
