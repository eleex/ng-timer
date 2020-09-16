import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Timer } from './models/timer.model';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private _timer: Timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
  };

  initTimer: Timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
  };

  dataTimer = new BehaviorSubject<Timer>(this.initTimer);

  startTimer(): void {
    this._timer.seconds++;
    if (this._timer.seconds > 59) {
      this._timer.minutes++;
      this._timer.seconds = 0;
    }
    if (this._timer.minutes > 59) {
      this._timer.hours++;
      this._timer.minutes = 0;
    }

    this.dataTimer.next(this._timer);
  }

  stopTimer(): void {
    this._timer = {
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.dataTimer.next(this.initTimer);
  }
}
