import {Component, OnInit} from '@angular/core';
import {BookingService, IBookingResp, IBookingRespBasic} from '../../../../services/booking.service';
import {Router} from '@angular/router';
import {displayErrorMessage} from '../../../../shared/messages/errorsMessage';
import {take} from 'rxjs';

@Component({
  selector: 'booking-finish',
  styleUrl: './booking-finish.component.scss',
  templateUrl: './booking-finish.component.html',
})
export class BookingFinishComponent implements OnInit{
  constructor(private router: Router, private bookingService: BookingService) {}

  createBookingResp: IBookingRespBasic;
  bookingInfo:IBookingResp;

  pickUpDateStr = '';
  returnDateStr = '';
  createdDateStr = '';

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    //Change to step 3
    this.bookingService.changeStep(3);

    this.bookingService.bookingResp$.pipe(take(1)).subscribe({
      next: (resp) => {
        this.createBookingResp = resp;

        this.pickUpDateStr = this.getDateStr(new Date(this.createBookingResp.pickUpDateTime));
        this.returnDateStr = this.getDateStr(new Date(this.createBookingResp.returnDateTime));
        this.createdDateStr = this.getDateStr(new Date(this.createBookingResp.createdAt));

        this.bookingService.getBookingById(this.createBookingResp.id).pipe(take(1)).subscribe({
          next: (bookingInfoResp) => {
            this.bookingInfo = bookingInfoResp;
          },
          error: () => {
            displayErrorMessage('An error occurred!');
          }
        })
      },
    });
  }

  getDateStr(date:Date):string {
    return `${date.getHours()}:${date.getMinutes()}, ${date.getDay()<10?`0${date.getDay()}`:`${date.getDay()}`}/${date.getMonth()+1<10?`0${date.getMonth()+1}`:`${date.getMonth()+1}`}/${date.getFullYear()}`;
  }
}
