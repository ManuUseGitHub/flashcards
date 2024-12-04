import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ButtonActions {
  left: IconDefinition;
  center: string;
  right: IconDefinition;
}

@Component({
  selector: 'app-surprise-button-group',
  templateUrl: './surprise-button-group.component.html',
  styleUrl: './surprise-button-group.component.scss',
  standalone: false,
})
export class SurpriseButtonGroupComponent {
  xSpread = 0;
  isPulsing = false;
  _hovering = false;
  get hovering() {
    return this._hovering;
  }

  set hovering(value: boolean) {
    this._hovering = value;
  }

  @Input() actions!: ButtonActions;
  @Output() choice = new EventEmitter<any>();
  @ViewChild('right') right!: any;
  @ViewChild('center') center!: any;
  @ViewChild('left') left!: any;

  getPickedButton() {
    if (this.xSpread == 0) {
      return 'center';
    }
    return this.xSpread < 0 ? 'right' : 'left';
  }

  pickButton() {
    let keyEvent = this.getPickedButton();
    this.togglePulse(
      {
        right: this.right,
        center: this.center,
        left: this.left,
      }[keyEvent]
    );
    this.choice.emit(keyEvent);
  }

  togglePulse(event: any) {
    if (!this.isPulsing) {
      this.isPulsing = true;
      event.nativeElement.classList.add('pulsing');

      setTimeout(() => {
        event.nativeElement.classList.toggle('pulsing');

        this.isPulsing = false;
      }, 600); // Reset after animation duration (0.3s)
    }
  }

  reveal(event: any) {
    const { offsetX } = event;
    const threshold = event.target.offsetWidth / 2;
    const middle = {
      x: -1 * (offsetX - threshold),
      //y: -1*(offsetY - (event.target.offsetHeight /2)),
    };
    const abs = Math.abs(middle.x);
    this.xSpread = abs > 50 ? (middle.x < 0 ? -50 : 50) : 0;
    this._hovering = true;
  }

  leave() {
    this.xSpread = 0;
    this._hovering = false;
  }

  get xSpreadTransformation() {
    return `translateX(${this.xSpread}px)`;
  }
}
