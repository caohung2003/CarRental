import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBookingInfoStates } from '../../create-booking/store/booking.states';
import {
  BookingService,
  IBookingResp,
} from '../../../../services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take, throttleTime } from 'rxjs';
import { LocationService } from '../../../../services/location.service';
import { ILocationResp } from '../../../../services/location.service';

@Component({
  styleUrl: './booking-details-basic.component.scss',
  templateUrl: './booking-details-basic.component.html',
  selector: 'booking-details-basic',
})
export class BookingDetailsBasicComponent implements OnInit, OnDestroy {
  bookingInfo: IBookingResp;
  pickUpDateStr: string = '';
  returnDateStr: string = '';
  depositStr: string = '';
  totalStr: string = '';
  location: string = '';
  wardName: string = '';
  districtName: string = '';
  cityName: string = '';
  dayDifferent: string = '';
  statusBooking: string = '';

  bookingServiceSubscription: Subscription;
  bookingInfoSubcription: Subscription;

  constructor(
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    //get bookingId
    this.activatedRoute.params.pipe(throttleTime(5000)).subscribe({
      next: (params) => {
        if (params['bookingId'])
          this.bookingService.setBookingId(params['bookingId']);
      },
    });
    //get booking info by id
    this.bookingServiceSubscription = this.bookingService.bookingId$
      .pipe(throttleTime(5000))
      .subscribe({
        next: (bookingId) => {
          this.bookingInfoSubcription = this.bookingService.getBookingById(parseInt(bookingId)).subscribe({
            next: (bookingResp) => {
              this.bookingInfo = bookingResp;
              this.statusBooking = this.bookingInfo.status;
              // this.depositStr = this.commafy(bookingResp.deposit);
              this.depositStr = this.commafy(bookingResp.deposit);
              this.totalStr = this.commafy((bookingResp.total));
              this.pickUpDateStr = this.convertDateTimeToStr(bookingResp.pickUpDateTime);
              this.returnDateStr = this.convertDateTimeToStr(bookingResp.returnDateTime);
              //Get Location by id
              this.locationService.getLocationByWardId(bookingResp.pickUpWardId.toString()).pipe(take(1)).subscribe({
                next: (value: ILocationResp) => {
                  this.location = this.bookingInfo.pickUpLocation;
                  this.wardName = value.wardName;
                  this.districtName = value.districtName;
                  this.cityName = value.cityName;
                },
              })
              this.dayDifferent = (((new Date(bookingResp.returnDateTime)).getTime() - (new Date(bookingResp.pickUpDateTime)).getTime()) / 24 / 60 / 60 / 1000).toString();
            }
          })
        },
      });
  }

  convertDateTimeToStr(input: Date): string {
    let output: Date = new Date(input);
    return `${output.getHours() < 10 ? `0${output.getHours()}` : `${output.getHours()}`}:${output.getMinutes() < 10 ? `0${output.getMinutes()}` : output.getMinutes()}, ${output.getDate() < 10 ? `0${output.getDate()}` : output.getDate()}/${(output.getMonth() + 1) < 10 ? `0${output.getMonth() + 1}` : (output.getMonth() + 1)}/${output.getFullYear()}`;
  }

  commafy(num: number): string {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
  }

  ngOnDestroy(): void {
    if (this.bookingInfoSubcription) this.bookingInfoSubcription.unsubscribe();
    if (this.bookingServiceSubscription)
      this.bookingServiceSubscription.unsubscribe();
  }
}
