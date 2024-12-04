import { EVENTS } from '../../ressources/enums';
import { EventService } from './event.service';

export class FieldEscapeCloser {
  escapeCount: number;
  constructor(private events: EventService) {
    this.escapeCount = 0;
    this.events.listen(EVENTS.RESET_ESCAPER.toString(), (event) => {
      this.escapeCount = /A|DIV/.test(event.target.tagName) ? 1:0;
    });
    this.events.listen(EVENTS.ESCAPED.toString(), (event: any) => {
      this.escapeCount = 1;
      event.target.blur();
    });
  }

  handleKey(event: any) {
    event.target.blur();
    if (event.key == 'Escape' && 2 <= ++this.escapeCount) {
      this.events.broadcast(EVENTS.LOST_FOCUS.toString(), { canClose: true });
    }
  }
}
