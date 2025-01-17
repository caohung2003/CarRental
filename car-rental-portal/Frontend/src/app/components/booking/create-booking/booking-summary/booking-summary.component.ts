import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBookingInfoStates } from '../../create-booking/store/booking.states';
import {
  BookingService,
  IBookingResp,
} from '../../../../services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take, throttleTime } from 'rxjs';
import { displayErrorMessage } from '../../../../shared/messages/errorsMessage';
import { LocationService } from '../../../../services/location.service';
import { ILocationResp } from '../../../../services/location.service';
import { CarBasicInfo } from '../../../../models/entities/car-basic.model';
import { CarService } from '../../../../services/car.service';

@Component({
  styleUrl: './booking-summary.component.scss',
  templateUrl: './booking-summary.component.html',
  selector: 'booking-summary',
})
export class BookingSummaryComponent implements OnInit, OnDestroy {
  // bookingInfo: IBookingResp;
  carInfo: CarBasicInfo;
  pickUpDateStr: string = '';
  returnDateStr: string = '';
  dayDifferent: string = '0';
  depositStr: string = '';
  totalStr: string = '';
  location: string = '';
  wardName: string = '';

  districtName: string = '';
  cityName: string = '';

  paramSubscription: Subscription;
  bookingServiceSubscription: Subscription;
  bookingInfoSubcription: Subscription;

  constructor(
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    //get car info
    this.paramSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        this.dayDifferent = (((new Date(params['returnDate'])).getTime() - (new Date(params['pickUpDate'])).getTime()) / 24 / 60 / 60 / 1000).toString();
        this.carService.getCarById(params['carId']).pipe(take(1)).subscribe({
          next: (carBasicInfoResp) => {
            this.totalStr = this.commafy(carBasicInfoResp.carPricing.basePrice * +this.dayDifferent );
            this.depositStr = this.commafy(carBasicInfoResp.carPricing.requiredDeposit);
          }
        })
        //get location by ward
        this.locationService.getLocationByWardId(params['ward']).pipe(take(1)).subscribe({
          next: (locationResp) => {
            this.wardName = locationResp.wardName;
            this.cityName = locationResp.cityName;
            this.districtName = locationResp.districtName;
          }
        })
        this.location = decodeURIComponent(params['street']);
        //get pickup and return Date
        this.pickUpDateStr = this.convertDateTimeToStr(new Date(params['pickUpDate']));
        this.returnDateStr = this.convertDateTimeToStr(new Date(params['returnDate']));
      }
    })
  }

  convertDateTimeToStr(input: Date): string {
    let output: Date = new Date(input);
    const formatPart = (part: number) => part < 10 ? `0${part}` : `${part}`;
    const hours = formatPart(output.getHours());
    const minutes = formatPart(output.getMinutes());
    const day = formatPart(output.getDate()); // Use getDate() instead of getDay() for the day of the month
    const month = formatPart(output.getMonth() + 1);
    const year = output.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
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
    if (this.paramSubscription)
      this.paramSubscription.unsubscribe();
  }
}
