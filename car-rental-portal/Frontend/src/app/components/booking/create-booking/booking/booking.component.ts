import { Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BookingService } from '../../../../services/booking.service';

@Component({
  styleUrl: './booking.component.scss',
  templateUrl: './booking.component.html',
  selector: 'app-booking',
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent implements OnInit, OnDestroy{
  showBookingForm : Observable<boolean>;

  constructor(
    private store:Store<any>,
    private bookingService:BookingService
  ) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
