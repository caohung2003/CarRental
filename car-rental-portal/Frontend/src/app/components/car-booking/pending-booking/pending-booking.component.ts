import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookingItemComponent} from "../booking-item/booking-item.component";
import {BookingService} from "../../../services/booking.service";
import {BookingResponseBasic} from "../../../models/interfaces/booking.response";
import {LocationService} from "../../../services/location.service";
import {forkJoin, map} from "rxjs";
import {CarService} from "../../../services/car.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/entities/user.model";
import {NgForOf, NgIf} from "@angular/common";
import {initFlowbite} from "flowbite";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../../services/errors.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from "@angular/router";


export interface Order {
  name: string,
  order: string
}

@Component({
  selector: 'app-pending-booking',
  standalone: true,
  imports: [
    BookingItemComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './pending-booking.component.html',
  styleUrl: './pending-booking.component.css'
})

export class PendingBookingComponent implements OnInit, OnChanges {
  public bookings: BookingResponseBasic[] = [];
  public status: string[] = ['PENDING'];
  @Input() public carId: string[] = [];
  public overlapBookings: number[] = [];
  public paymentType: string[] = [];
  public sorts: Order[] = [];
  public totalElements: number;

  constructor(
    private bookingService: BookingService,
    private locationService: LocationService,
    private carService: CarService,
    private userService: UserService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router
  ) {
    initFlowbite();
  }

  public page: number = 0;
  public sort: string = "";
  public order: string = "";

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

  filter(type: string) {
    this.page = 0;

    var a = document.getElementById("dropdownRadioHelper");
    if (a != null) {
      a.classList.add("tw-hidden");
    }
  }


  srt(column: string) {
    this.sorts = [];
    if (column == "duration") {
      if ((this.sort == "" && this.order == "") || (this.sort == "price") || (this.sort == "time")) {
        this.sort = "duration";
        this.order = "asc";
        var a = (document.getElementById("sortdurationimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortpriceimg3") as HTMLImageElement);
        if (b != null)
          b.src = "";
        var c = (document.getElementById("sortdateimg3") as HTMLImageElement);
        if (c != null)
          c.src = "";
      } else if (this.sort == "duration" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortdurationimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "duration" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortdurationimg3") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var d = document.getElementById("actionsDropdown");
      if (d != null) {
        d.classList.add("tw-hidden");
      }
    } else if (column == "price") {
      if ((this.sort == "" && this.order == "") || (this.sort == "duration") || (this.sort == "time")) {
        this.sort = "price";
        this.order = "asc";
        var a = (document.getElementById("sortpriceimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortdurationimg3") as HTMLImageElement);
        if (b != null)
          b.src = "";
        var c = (document.getElementById("sortdateimg3") as HTMLImageElement);
        if (c != null)
          c.src = "";
      } else if (this.sort == "price" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortpriceimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "price" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortpriceimg3") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var d = document.getElementById("actionsDropdown");
      if (d != null) {
        d.classList.add("tw-hidden");
      }
    } else if (column == "date") {
      if ((this.sort == "" && this.order == "") || (this.sort == "duration") || (this.sort == "price")) {
        this.sort = "time";
        this.order = "asc";
        var a = (document.getElementById("sortdateimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortdurationimg3") as HTMLImageElement);
        if (b != null)
          b.src = "";
        var c = (document.getElementById("sortpriceimg3") as HTMLImageElement);
        if (c != null)
          c.src = "";
      } else if (this.sort == "time" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortdateimg3") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "time" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortdateimg3") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var d = document.getElementById("actionsDropdown");
      if (d != null) {
        d.classList.add("tw-hidden");
      }
    }
    var order: Order = {
      name: this.sort,
      order: this.order
    }
    this.sorts.push(order);
    this.getBookings();
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
    this.page = p;
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.getBookings();
  }

  public getBookings() {
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
            road: element.road
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
    this.bookings = [];
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
            b.carImage = response.carDetail.frontImgUrl
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

  show() {
    var a = document.getElementById("actionsDropdown1");
    if (a != null) {
      a.setAttribute("data-popper-placement", "bottom");
      if (a.classList.contains("tw-hidden")) {
        a.classList.remove("tw-hidden");
      } else {
        a.classList.add("tw-hidden");
      }
    }
  }

  public clickBooking: number = 0;
  getOverlappBooking(booking: BookingResponseBasic) {
    this.clickBooking = booking.id;
    this.bookingService.getOverlappBookings(booking.id, 'PENDING').subscribe(
      (response: any) => {
        this.overlapBookings = response;

      }
    )
  }
}
