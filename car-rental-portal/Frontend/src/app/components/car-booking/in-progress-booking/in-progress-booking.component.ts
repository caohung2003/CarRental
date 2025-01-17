import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookingItemComponent} from "../booking-item/booking-item.component";
import {NgForOf, NgIf} from "@angular/common";
import {BookingResponseBasic} from "../../../models/interfaces/booking.response";
import {BookingService} from "../../../services/booking.service";
import {LocationService} from "../../../services/location.service";
import {CarService} from "../../../services/car.service";
import {UserService} from "../../../services/user.service";
import {forkJoin, map} from "rxjs";
import {User} from "../../../models/entities/user.model";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../../services/errors.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-progress-booking',
  standalone: true,
  imports: [
    BookingItemComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './in-progress-booking.component.html',
  styleUrl: './in-progress-booking.component.css'
})
export class InProgressBookingComponent implements OnInit, OnChanges {
  public bookings: BookingResponseBasic[] = [];
  public status: string[] = ['PENDING_DEPOSIT', 'PENDING_PICK_UP', 'IN_PROGRESS', 'PENDING_PAYMENT'];
  @Input() public carId: string[] = [];
  public paymentType: string[] = [];
  public sorts: [] = [];
  public totalElements: number;

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName == 'carId') {
        let change = changes[propName];
        let curVal = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);
        if (prevVal != undefined) {
          if (prevVal != curVal) {
            this.page = 0;
            this.getBookings();
          }
        }
      }
      break;

    }
  }

  constructor(
    private bookingService: BookingService,
    private locationService: LocationService,
    private carService: CarService,
    private userService: UserService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router
  ) {
  }

  public page: number = 0;
  public sort: string;
  public order: string;

  filter(type: string) {
    this.page = 0;

    var a = document.getElementById("dropdownRadioHelper");
    if (a != null) {
      a.classList.add("tw-hidden");
    }
  }

  show() {
    var a = document.getElementById("actionsDropdown2");
    if (a != null) {
      a.setAttribute("data-popper-placement", "bottom");
      if (a.classList.contains("tw-hidden")) {
        a.classList.remove("tw-hidden");
      } else {
        a.classList.add("tw-hidden");
      }
    }
  }

  srt(column: string) {
    if (column == "rating") {
      if ((this.sort == "" && this.order == "") || (this.sort == "noRides")) {
        this.sort = "rating";
        this.order = "asc";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (b != null)
          b.src = "";
      } else if (this.sort == "rating" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "rating" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var c = document.getElementById("actionsDropdown");
      if (c != null) {
        c.classList.add("tw-hidden");
      }
    } else if (column == "rides") {
      if ((this.sort == "" && this.order == "") || (this.sort == "rating")) {
        this.sort = "noRides";
        this.order = "asc";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (b != null)
          b.src = "";
      } else if (this.sort == "noRides" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "noRides" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var c = document.getElementById("actionsDropdown");
      if (c != null) {
        c.classList.add("tw-hidden");
      }
    }

  }
  public totalPages: number;
  public pageArr: number[] = [];

  public createArray(): void {
    this.pageArr = [];
    for (let i = 0; i < this.totalPages; i++) {
      this.pageArr.push(i + 1);
    }
  }

  switchPage(p: number) {
    console.log(p);
    this.page = p;
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.getBookings();
  }
  getBookings() {
    this.bookings = [];
    this.bookingService.getUserBooking(this.status, this.carId, this.paymentType, this.sorts, this.page).subscribe(
      (response: any) => {
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.createArray();
        for (const element of response.content) {
          var isRating = false;
          var br = {
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
            message: element.message,
            paymentType: element.paymentType,
            isRating: isRating,
            wardId: element.wardId,
            road: element.road,
          };
          this.bookings.push(br);
        }
        this.getLocationBasedOnWardId();
        this.getUserBasedOnUserId();
        this.getCarBasedOnCarId();
      },
      (error:HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    )
  }

  ngOnInit(): void {
    this.getBookings();
  }

  public getCarBasedOnCarId() {
    forkJoin(
      this.bookings.map(b =>
        this.carService.getCarById(b.carId).pipe(
          // map each Location to a cloned provider object
          map(response => {
            var resp: any = response;
            b.carName = response.brandModel.brand.name + ' ' + response.brandModel.modelName;
            b.carImage =  response.carDetail.frontImgUrl
          }))
      )
    ).subscribe(c => {
      // flatten the multi-dimensional array
      //  const updatedProviders = [].concat(...p);

    });
  }

  public getUserBasedOnUserId() {
    forkJoin(
      this.bookings.map(b =>
        this.userService.gerUserInfo_basic(b.userId).pipe(
          // map each Location to a cloned provider object
          map(response => {
            var user = new User();

            user.phone = response.phone;
            user.firstName = response.firstName;
            user.lastName = response.lastName;
            user.email = response.email;
            user.rating = response.rating;
            user.avatar = response.avatar;
            b.user = user;
          }))
      )
    ).subscribe(c => {
      // flatten the multi-dimensional array
      //  const updatedProviders = [].concat(...p);

    });
  }

  public getLocationBasedOnWardId() {
    forkJoin(
      this.bookings.map(b =>
        this.locationService.getWardsById(Number(b.wardId)).pipe(
          // map each Location to a cloned provider object
          map(response => {
            if (b.road != null) {
              b.road = response.district.city.cityName + ", " + response.district.districtName + ", " + response.wardName + ", " + b.road;
            } else {
              b.road = response.district.city.cityName + ", " + response.district.districtName + ", " + response.wardName;

            }
          }))
      )
    ).subscribe(c => {
      // flatten the multi-dimensional array
      //  const updatedProviders = [].concat(...p);

    });
  }
}
