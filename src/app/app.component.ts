import { TimerService } from './timer.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, timer, fromEvent } from 'rxjs';
import { buffer, debounce, filter, takeWhile } from 'rxjs/operators';

import { Timer } from './models/timer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isActive = false;
  appTimer: Timer;
  subTimer: Subscription = new Subscription();
  componentAlive = true;
  @ViewChild('wait') waitBtn: ElementRef;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.timerService.dataTimer.subscribe((data) => {
      this.appTimer = data;
    });
  }

  ngAfterViewInit(): void {
    const clickSource = fromEvent(this.waitBtn.nativeElement, 'click');
    clickSource
      .pipe(
        buffer(clickSource.pipe(debounce(() => timer(300)))),
        filter((v) => v.length > 1),
        takeWhile(() => this.componentAlive)
      )
      .subscribe(() => {
        this.onWait();
      });
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
    this.subTimer.unsubscribe();
  }

  onStart(): void {
    this.isActive = true;

    const start = timer(1000, 1000);
    this.subTimer = start.subscribe(() => {
      this.timerService.startTimer();
    });
  }

  onStop(): void {
    this.isActive = false;
    this.subTimer.unsubscribe();

    this.timerService.stopTimer();
  }

  onWait(): void {
    this.isActive = false;
    this.subTimer.unsubscribe();
  }

  onReset(): void {
    this.isActive = true;
    this.subTimer.unsubscribe();

    this.timerService.stopTimer();

    const start = timer(1000, 1000);
    this.subTimer = start.subscribe((v) => {
      this.timerService.startTimer();
    });
  }
}
