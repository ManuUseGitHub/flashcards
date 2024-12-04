import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EventService } from '../event.service';
import { EVENTS } from '../../../ressources/enums';
import { icons } from '../../../ressources/icons';
import { Subscription } from 'rxjs';
import { FieldEscapeCloser } from '../filedEscapCloser';

@Component({
  selector: 'app-popover-with-html',
  templateUrl: './popover-with-html.component.html',
  styleUrl: './popover-with-html.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class PopoverWithHTMLComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  services: Subscription[] = [];
  @Input()
  maxWidth: number = 200;

  @ViewChild('popoverTriggerer') popoverTriggerer!: ElementRef;

  @Input()
  isPopoverVisible = false;

  @Input()
  styleClass: string = '';

  @Input()
  name = '';

  icons = icons;
  growDirection = 'center';
  _focusDirection = 'right';
  isMouseIn: boolean = false;
  timer: any;

  get computedStyle() {
    const style: { [x: string]: any } = {
      width: this.maxWidth + 'px',
    };
    if (this.growDirection == 'right') {
      style['transform'] = 'translateX(60px)';
      style['right'] = 0;
    } else if (this.growDirection == 'left') {
      style['transform'] = 'translateX(-60px)';
      style['left'] = 0;
    }
    return style;
  }

  get arrowComputedStyle() {
    const style: { [x: string]: any } = {};
    if (this.growDirection == 'right') {
      style['right'] = 0;
      style['transform'] = 'translate(-60px, 0px)';
    } else if (this.growDirection == 'left') {
      style['left'] = 0;
      style['transform'] = 'translate(60px, 0px)';
    }

    return style;
  }

  constructor(private events: EventService) {}
  ngAfterViewInit(): void {
    const hasPass2Third =
      this.popoverTriggerer.nativeElement.getBoundingClientRect().x >
      (window.innerWidth / 3) * 2;
    const hasPass1Third =
      this.popoverTriggerer.nativeElement.getBoundingClientRect().x >
      window.innerWidth / 3;
    if (hasPass2Third) {
      this.growDirection = 'right';
    } else if (!hasPass1Third) {
      this.growDirection = 'left';
    }
  }

  ngOnInit() {
    this.services.push(
      ...[
        this.events.listen(
          EVENTS.TAB_DIRECTION.toString(),
          (payload: { event: any; canClose: boolean }) => {
            const { event } = payload;
            this._focusDirection = event.shiftKey ? 'left' : 'right';
          }
        ),
        this.events.listen(
          EVENTS.LOST_FOCUS.toString(),
          (event: { event: any; canClose: boolean }) => {
            if (!this.isMouseIn) {
              this.hidePopover(event, event.canClose);
            }
          }
        ),
        this.events.listen(EVENTS.CLOSE_OTHER_POPOVERS.toString(), () => {
          this.isPopoverVisible = false;
        }),
      ]
    );
  }
  resetEscapeCount(event: any) {
    this.events.broadcast(EVENTS.RESET_ESCAPER.toString(), event);
  }

  togglePopover(event: any) {
    setTimeout(() => {
      {
        const state = this.isPopoverVisible;
        if (!state) {
          this.events.broadcast(EVENTS.CLOSE_OTHER_POPOVERS.toString(), event);
          this.events.broadcast(EVENTS.RESET_ESCAPER.toString(), event);
        }
        this.isPopoverVisible = !this.isPopoverVisible;
      }
    }, 100);
  }

  hidePopover(event: any, canClose = false) {
    const endReached = !!Object.values(
      document.activeElement!.getAttributeNames()
    ).find((x) => /end-popover/.test(x));

    if (
      (this._focusDirection == 'left' && !canClose) ||
      (this._focusDirection == 'right' && canClose)
    ) {
      this.isPopoverVisible = false;
    }
    if (endReached) {
      this.isPopoverVisible = false;
      this.events.broadcast(EVENTS.FOCUS_NEXT.toString(), event.target);
    }
  }

  showPopover() {
    this.isPopoverVisible = true;
  }

  ngOnDestroy() {
    this.services.forEach((x) => {
      x.unsubscribe();
    });
  }
}
