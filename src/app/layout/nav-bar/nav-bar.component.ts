import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { icons } from '../../../ressources/icons';
import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import {
  fromEvent,
  map,
  Observable,
  Subscription,
  throttleTime,
} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
})
export class NavBarComponent implements AfterViewInit, OnDestroy {
  icons = icons;
  toolbarOfsetH: number = 0;
  scrollTop: number = 0;
  services: Subscription[] = [];
  @ViewChild('content') content!: { elementRef: ElementRef };
  @ViewChild('toolbar') toolbar!: ElementRef;

  get isSticking(){
    return this.toolbarOfsetH*4 < this.scrollTop
  }

  isHandset$: Observable<boolean> = this.bpObserver
    .observe(Breakpoints.Handset)
    .pipe(map((x) => x.matches));

  constructor(private bpObserver: BreakpointObserver) {}
  ngOnDestroy(): void {
    this.services.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const [content, toolbar] = [
        this.content.elementRef.nativeElement,
        this.toolbar.nativeElement,
      ];

      this.toolbarOfsetH = toolbar.offsetHeight;

      this.services.push(
        fromEvent(content, 'scroll')
          .pipe(throttleTime(60))
          .subscribe((ev) => {
            this.scrollTop = content.scrollTop;
          })
      );
    }, 500);
  }

  logout() {
    // Implement your logout logic here
    console.log('User logged out');
  }
}
