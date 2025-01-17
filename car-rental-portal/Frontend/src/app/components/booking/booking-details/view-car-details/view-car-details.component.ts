import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take, throttleTime } from 'rxjs';
import { CarBasicInfo } from '../../../../models/entities/car-basic.model';
import {
  BookingService,
  IBookingResp,
} from '../../../../services/booking.service';
import { CarService } from '../../../../services/car.service';
import { displayErrorMessage } from '../../../../shared/messages/errorsMessage';

@Component({
  styleUrl: './view-car-details.component.scss',
  templateUrl: './view-car-details.component.html',
  selector: 'view-booking-details',

})
export class ViewCarDetailsComponent implements OnInit, OnDestroy {
  bookingDetails: IBookingResp;
  carInfo: CarBasicInfo = new CarBasicInfo();
  starPercentage: string;
  carLocation: string = '';
  numberOfDays: number = -1;
  images: string[] = [];
  carPriceStr: string = '';

  bookingServiceSubscription: Subscription;
  carServiceSubscription: Subscription;
  paramsSubscription: Subscription;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    //get booking params
    this.paramsSubscription = this.bookingService.bookingId$.subscribe({
      next: (bookingId) => {
        //check if booking id is existed or not
        if (bookingId && bookingId !== '') {
          //get booking details
          this.bookingServiceSubscription = this.bookingService
            .getBookingById(parseInt(bookingId))
            .pipe(throttleTime(5000))
            .subscribe({
              next: (bookingDetailsResp) => {
                this.bookingDetails = bookingDetailsResp;
                this.bookingDetails.pickUpDateTime = new Date(
                  this.bookingDetails.pickUpDateTime
                );
                this.bookingDetails.returnDateTime = new Date(
                  this.bookingDetails.returnDateTime
                );

                this.numberOfDays = this.getNumberOfDayDifferences(
                  this.bookingDetails.pickUpDateTime,
                  this.bookingDetails.returnDateTime
                );

                //Get car by Id
                this.carServiceSubscription = this.carService
                  .getCarById(bookingDetailsResp.carId)
                  .pipe(throttleTime(5000))
                  .subscribe({
                    next: (carInfoResp) => {
                      this.carInfo = carInfoResp;
                      

                      //get price
                      this.carPriceStr = this.commafy(carInfoResp.carPricing.basePrice);
                      // console.log(carInfoResp);
                      this.calculateStarPercentage(carInfoResp.rating);
                      this.carLocation =
                        (this.carInfo.carLocations[0].road
                          ? this.carInfo.carLocations[0].road
                          : '') +
                        ' ' +
                        this.carInfo.carLocations[0].ward.wardName +
                        ', ' +
                        this.carInfo.carLocations[0].ward.district
                          .districtName +
                        ', ' +
                        this.carInfo.carLocations[0].ward.district.city
                          .cityName;
                      if (this.images.length === 0) {
                        this.images.push(this.carInfo.carDetail.frontImgUrl);
                        this.images.push(this.carInfo.carDetail.backImgUrl);
                        this.images.push(this.carInfo.carDetail.leftImgUrl);
                        this.images.push(this.carInfo.carDetail.rightImgUrl);
                      }
                    },
                    error: () => {
                      displayErrorMessage('An error occurred!');
                    },
                  });
              },
            });
        }
      },
      error: (error) => {
        displayErrorMessage(error);
      },
    });
  }

  calculateStarPercentage(rating: number) {
    const starPercentage = (rating / 5) * 100;
    const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
    this.starPercentage = starPercentageRounded;
  }

  ngOnDestroy(): void {
    if (this.carServiceSubscription) this.carServiceSubscription.unsubscribe();
    if (this.bookingServiceSubscription)
      this.bookingServiceSubscription.unsubscribe();
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
  }

  getNumberOfDayDifferences(pickUpDate: Date, returnDate: Date): number {
    return Math.floor(
      (returnDate.getTime() - pickUpDate.getTime()) / (1000 * 60 * 60 * 24)
    );
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
}
