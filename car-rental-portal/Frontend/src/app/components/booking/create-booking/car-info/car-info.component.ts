import { Component } from '@angular/core';
import { displayErrorMessage } from '../../../../shared/messages/errorsMessage';
import { Subscription, take, throwError } from 'rxjs';
import { BookingService, IBookingResp } from '../../../../services/booking.service';
import { CarBasicInfo } from '../../../../models/entities/car-basic.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../../services/car.service';

@Component({
  styleUrl: './car-info.component.scss',
  templateUrl: './car-info.component.html',
  selector: 'car-info-create',
})
export class CarInfoComponent {
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
    private bookingService: BookingService,
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
    //get car id
    this.paramsSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        this.carService.getCarById(params['carId']).pipe(take(1)).subscribe({
          next: (carInfo) => {
            this.carInfo = carInfo;
            this.carPriceStr = this.commafy(carInfo.carPricing.basePrice);
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
          error: (error) => {
            return throwError(() => error);
          }
        })
      },
      error: (error) => {
        displayErrorMessage(error.error.errorDetails);
        this.router.navigate(['/home']);
      }
    })
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
