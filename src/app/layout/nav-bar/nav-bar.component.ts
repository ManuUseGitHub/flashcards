import {
  AfterViewInit,
  Component,
  ElementRef,
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
  throttleTime,
} from 'rxjs';
import { SubscriberComponent } from '../../shared/subscriber/subscriber.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
})
export class NavBarComponent extends SubscriberComponent implements AfterViewInit {
  icons = icons;
  toolbarOfsetH: number = 0;
  scrollTop: number = 0;
  @ViewChild('content') content!: { elementRef: ElementRef };
  @ViewChild('toolbar') toolbar!: ElementRef;

  get isSticking(){
    return this.toolbarOfsetH*4 < this.scrollTop
  }

  isHandset$: Observable<boolean> = this.bpObserver
    .observe(Breakpoints.Handset)
    .pipe(map((x) => x.matches));

  constructor(private bpObserver: BreakpointObserver) {
    super()
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const [content, toolbar] = [
        this.content.elementRef.nativeElement,
        this.toolbar.nativeElement,
      ];

      this.toolbarOfsetH = toolbar.offsetHeight;

      this.subscribe(
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
