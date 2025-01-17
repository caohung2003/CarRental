import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { BOOKING_STATUS } from "../../models/enums/booking-status";
import { BookingResponseBasic } from '../../models/interfaces/booking.response';
import { CommonModule } from '@angular/common';
import { CarService } from '../../services/car.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { RatingService } from "../../services/rating.service";
import { ErrorsService } from "../../services/errors.service";
import { forkJoin, map, take } from "rxjs";
import { RatingCarComponent } from "../rating/rating-car/rating-car.component";
import { RatingViewCarComponent } from "../rating/rating-view-car/rating-view-car.component";
import { AuthService } from '../../services/auth.service';
import { BookingItemComponent } from './booking-item/booking-item.component';
import { ILocationResp, LocationService } from '../../services/location.service';

export interface CarInfo {
  id: number,
  images: string[],
  name: string,
  rating: number,
  rides: number,
  seats: number,
  transmission: string,
  license: string,
  insuranceStatus: boolean,

}

@Component({
  selector: 'app-mybooking',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    RatingCarComponent,
    RatingViewCarComponent,
    RouterModule,
    BookingItemComponent,
  ],
  templateUrl: './mybooking.component.html',
  styleUrl: './mybooking.component.css'
})

export class MybookingComponent implements OnInit {

  isMore: boolean = false;
  url = '';
  constructor(
    readonly httpServide: HttpService,
    private userService: UserService,
    private router: Router,
    private carService: CarService,
    private ratingService: RatingService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private locationService: LocationService,
  ) {
    this.url = this.router.url;
  }

  @ViewChild('available') available!: ElementRef;
  @ViewChild('non_available') non_available!: ElementRef;
  @ViewChild('status') stt!: ElementRef;

  listAvailableBooking: BookingResponseBasic[] = [];
  listCarByBooking: CarInfo[] = [];
  listLocation = [{
    id: 0,
    value: '',
  }]
  isAvailableTab: boolean;
  isLoading: boolean = true;

  public page: number = 0;
  public totalPages: number = 0;
  public totalElements: number = 0;
  public size: number = 5;

  status: string = BOOKING_STATUS.ALL;
  sortBy: string = '';
  sortOrder: string = 'desc';

  currentSort = '';
  listSort = [
    {
      name: 'Most recently modified',
      value: 'modify',
    },
    {
      name: 'Latest pick-up time',
      value: 'pick-up',
    },
    {
      name: 'Latest booking time',
      value: 'booking',
    },
    {
      name: 'Price ascending',
      value: 'price-asc',
    },
    {
      name: 'Price descending',
      value: 'price-desc',
    }
  ];

  listStatus = [
    {
      name: 'PENDING',
      value: 'PENDING',
    },
    {
      name: 'PENDING DEPOSIT',
      value: 'PENDING_DEPOSIT',
    },
    {
      name: 'PENDING PICK UP',
      value: 'PENDING_PICK_UP',
    },
    {
      name: 'IN PROGRESS',
      value: 'IN_PROGRESS',
    },
    {
      name: 'PENDING PAYMENT',
      value: 'PENDING_PAYMENT',
    },
  ]

  async ngOnInit(): Promise<void> {
    this.isAvailableTab = true;
    await this.getBooking(this.status, this.sortBy, this.page, this.size, this.sortOrder);
    await this.saveCarInfor();
  }

  public pageArr: number[] = [];

  public createArray(): void {
    this.pageArr = [];
    for (let i = 0; i < this.totalPages; i++) {
      this.pageArr.push(i + 1);
    }
  }

  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('dropdownStatus') dropdownStatus!: ElementRef;
  isShow = false;
  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.dropdown.nativeElement.contains(target);
    const clickedInsideStatus = this.dropdownStatus.nativeElement.contains(target);
    if (!clickedInside) {
      this.isShow = false;
    }
    if (!clickedInsideStatus) {
      this.isShowStatus = false;
    }
  }

  show() {
    this.isShow = !this.isShow;
  }

  isShowStatus = false;
  showStatus() {
    this.isShowStatus = !this.isShowStatus;
  }

  async switchPage(p: number) {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await this.getBooking(this.status, this.sortBy, this.page, this.size, this.sortOrder);
    await this.saveCarInfor();
  }

  logout() {
    this.authService.logout(true);
  }

  async changeTab(isAvailableTab: boolean) {
    if (isAvailableTab != this.isAvailableTab) {
      this.isAvailableTab = isAvailableTab;
      if (isAvailableTab) {
        this.listStatus = [
          {
            name: 'PENDING',
            value: 'PENDING',
          },
          {
            name: 'PENDING DEPOSIT',
            value: 'PENDING_DEPOSIT',
          },
          {
            name: 'PENDING PICK UP',
            value: 'PENDING_PICK_UP',
          },
          {
            name: 'IN PROGRESS',
            value: 'IN_PROGRESS',
          },
          {
            name: 'PENDING PAYMENT',
            value: 'PENDING_PAYMENT',
          },
        ]
      } else {
        this.listStatus = [
          {
            name: 'COMPLETED',
            value: 'COMPLETED',
          },
          {
            name: 'CANCELLED',
            value: 'CANCELLED',
          },
        ]
      }
      this.page = 0;
      this.sortBy = '';
      this.status = '';
      await this.getBooking(this.status, this.sortBy, this.page, this.size, this.sortOrder);
      await this.saveCarInfor();
    }
  }

  getBooking(status: string, sortBy?: string, page?: number, size?: number, sortOrder?: string): Promise<any> {
    this.isLoading = true;
    let load = true;
    if (status == '') {
      if (this.isAvailableTab) {
        status = 'PENDING,PENDING_DEPOSIT,PENDING_PICK_UP,IN_PROGRESS,PENDING_PAYMENT';
      } else {
        status = 'COMPLETED,CANCELLED';
      }
    }
    return new Promise((resolve, reject) => {
      this.userService.getBookingList(status, sortBy, page, size, sortOrder).subscribe((response: any) => {
        this.listAvailableBooking = [];
        this.listLocation = [];
        console.log(response);
        let br: BookingResponseBasic = {
          id: 0,
          userId: 0,
          carId: 0,
          pickUpDateTime: '',
          returnDateTime: '',
          basePrice: 0,
          deposit: 0,
          total: 0,
          status: '',
          createdAt: '',
          numberOfDays: 0,
          carOwnerMessage: '',
          paymentType: '',
          isRating: false
        };
        for (const element of response.content) {
          var isRating = false;
          br = {
            id: element.id,
            userId: element.userId,
            carId: element.carId,
            pickUpDateTime: element.pickUpDateTime,
            returnDateTime: element.returnDateTime,
            basePrice: element.basePrice,
            deposit: element.deposit,
            total: element.total,
            status: element.status,
            createdAt: element.createdAt,
            numberOfDays: element.numberOfDays,
            carOwnerMessage: element.carOwnerMessage,
            paymentType: element.paymentType,
            isRating: isRating,
            wardId: element.wardId,
            road: element.road,
            renterMessage: element.carOwnerMessage,
          };
          this.locationService.getLocationByWardId(element.wardId).pipe(take(1)).subscribe({
            next: (value: ILocationResp) => {
              let road = (element.road && element.road !== "undefined") ? element.road + ", " : "";
              let location = road + value.wardName + ", "
                + value.districtName + ", "
                + value.cityName;
              this.listLocation.push({
                id: element.id,
                value: location,
              })
            },
          })

          this.listAvailableBooking.push(br);
        }
        this.checkRate(this.listAvailableBooking);
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.createArray();
        if (this.totalElements > this.size * (this.page + 1)) this.isMore = true;
        else this.isMore = false;
        // console.log('list', this.listAvailableBooking);
        resolve(response);
      }, error => {
        console.error(error);
        load = false;
        reject(error);
      }, () => {
        if (!load) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      }
      );
    }
    );
  }


  public checkRate(bookings: BookingResponseBasic[]): void {
    forkJoin(
      bookings.map(p =>
        this.ratingService.getAllRatingsByBooking(p.id).pipe(
          // map each Location to a cloned provider object
          map(response => {
            // console.log("Resposne:" + p.id);
            // console.log(response);
            var resp: any = response;
            if (resp.length > 0) {
              for (let i = 0; i < resp.length; i++) {
                if (resp[i].isRenterFeedback) {
                  p.isRating = true;
                  break;
                }
              }

            }
          }))
      )
    ).subscribe(p => {
      // flatten the multi-dimensional array
      //  const updatedProviders = [].concat(...p);

      // console.log(p)
    });
  }

  async saveCarInfor() {
    const promises = this.listAvailableBooking.map(booking => this.getCarAPI(booking.carId));
    await Promise.all(promises);
    console.log('cars', this.listCarByBooking);
  }

  getCar(id: any) {
    let one: CarInfo = {
      id: 0,
      images: [],
      name: '',
      rating: 0,
      rides: 0,
      seats: 0,
      transmission: '',
      license: '',
      insuranceStatus: false,
    };
    const foundCar = this.listCarByBooking.find(car => car.id === id);
    if (foundCar !== undefined) {
      return foundCar;
    } else {
      return one;
    }
  }

  getLocation(id: any) {
    const foundCar = this.listLocation.find(loc => loc.id === id);
    if (foundCar !== undefined) {
      return foundCar.value;
    } else {
      return '';
    }
  }

  getCarAPI(id: any): Promise<CarInfo> {
    return new Promise((resolve, reject) => {
      this.carService.getCarDetail(id).subscribe(
        (response: any) => {
          // console.log('car: ', response);
          const carInfo: CarInfo = {
            id: response.id,
            images: [response.carDetail.frontImgUrl, response.carDetail.backImgUrl, response.carDetail.leftImgUrl, response.carDetail.rightImgUrl],
            name: response.brandModel.brand.name + " " + response.brandModel.modelName,
            rating: response.rating,
            rides: response.noRides,
            seats: response.noSeat,
            transmission: response.transmission,
            license: response.licensePlate,
            insuranceStatus: response.insuranceStatus,
          };
          this.listCarByBooking.push(carInfo);
          resolve(carInfo); // Resolve the promise with the carInfo
        },
        error => {
          reject(error); // Reject the promise on error
        }
      );
    });
  }

  typeSort(type: string) {
    if (this.currentSort === type) {
      this.sortBy = '';
      this.sortOrder = 'asc';
      this.currentSort = '';
    } else {
      this.currentSort = type;
      switch (type) {
        case ('modify'):
          // this.sortOrder = 'desc';
          // this.sortBy = 'modifyAt';
          return;
        case ('booking'):
          this.sortOrder = 'desc';
          this.sortBy = 'createdAt';
          break;
        case ('pick-up'):
          this.sortOrder = 'desc';
          this.sortBy = 'pickUpAt';
          break;
        case ('price-asc'):
          this.sortOrder = 'asc';
          this.sortBy = 'total';
          break;
        case ('price-desc'):
          this.sortOrder = 'desc';
          this.sortBy = 'total';
          break;
      }
    }
    for (let i = 0; i <= this.page; i++) {
      this.getBooking(this.status, this.sortBy, i, this.size, this.sortOrder);
    }
  }

  formatDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day.length < 2 ? "0" + day : day}/${month.length < 2 ? "0" + month : month}/${year}`;
  }

  public checkDateExpired(pickUpDateTime: string): boolean {
    if (new Date(new Date(pickUpDateTime).getTime() + 7 * 86400000).getTime() < new Date().getTime()) {
      return true;
    } else {
      return false;
    }
  }

  async changeStatus(status: string) {
    this.listAvailableBooking = [];
    this.status = status;
    this.page = 0;
    await this.getBooking(this.status, this.sortBy, this.page, this.size, this.sortOrder);
  }

  findAncestor(element: any, className: string) {
    while (element && !element.classList.contains(className)) {
      element = element.parentElement;
    }
    return element;
  }

  async cancelBooking(id: any, event: any) {
    try {
      const confirmed = await this.errorService.showModalConfirm();
      if (confirmed) {
        this.userService.cancelBooking(id).subscribe(
          (response: any) => {
            this.errorService.showSwalToastMessage('success', 'You have successfully CANCELLED your trip. If you have any questions or complaints, please contact the hotline: 0999.888.666', 'top-end', 5000);
            let ancestor = this.findAncestor(event.target, 'item-car');

            // Set display to 'none' if ancestor exists
            if (ancestor) {
              ancestor.style.display = 'none';
            }
          },
          error => {
            console.log(error);
            this.errorService.showSwalToastMessage('error', 'An error has occurred. Please try again or contact the hotline: 0999.888.666 if you have any questions.', 'top-end', 5000);
          });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors if any
    }

  }

  min(n1: number, n2: number): number {
    return n1 > n2 ? n2 : n1;
  }

  convert(input: string): string {
    return input.replace(/_/g, ' ');
  }

  redirect(link: string) {
    window.location.href = link;
  }

  showOption(index: any) {
    const drop = document.getElementById('bi' + index);
    if (drop) {
      if (drop.classList.contains('tw-hidden')) {
        drop.classList.remove('tw-hidden');
      } else {
        drop.classList.add('tw-hidden');
      }
    }
  }

}
