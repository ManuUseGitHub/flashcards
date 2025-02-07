import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs';
import { EVENTS } from '../../ressources/enums';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private subject = new Subject();

  broadcast(eventName: string, payload: any) {
    this.subject.next({ eventName, payload });

    if (isDevMode()) {
      if (eventName != EVENTS.DEBUG.toString()) {
        let source: any = null;

        if (payload?.event && payload.event instanceof PointerEvent) {
          source = payload.event.target;
        }

        this.subject.next({
          eventName: EVENTS.DEBUG,
          payload: {
            //name: EVENTS[Number.parseInt(eventName)],
            name: eventName,
            payload: { source, payload },
          },
        });
      }
    }
  }

  listen(eventName: string, callback: (event: any) => void) {
    return this.subject.asObservable().subscribe((nextObj: any) => {
      if (eventName === nextObj.eventName) {
        callback(nextObj.payload);
      }
    });
  }
}
