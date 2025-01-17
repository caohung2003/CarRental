import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil, tap, timer } from 'rxjs';

export class LoadingService {
  private timeoutOccurredSource = new Subject<void>();
  timeoutOccurred$ = this.timeoutOccurredSource.asObservable();

  notifyTimeoutOccurred(): void {
    this.timeoutOccurredSource.next();
  }
}

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent{
  // loading: boolean = true;
  // message: string = '';

  // private destroy$ = new Subject<void>();

  // constructor() { }

  // ngOnInit(): void {
  //   timer(10000).pipe(
  //     takeUntil(this.destroy$),
  //     tap(() => {
  //       this.message = 'Response time is too long. Sorry about this problem. Try again later...';
  //     })
  //   ).subscribe(() => {
  //     this.loading = false;
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
