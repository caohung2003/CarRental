import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CarService} from "../../services/car.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MyCar} from '../../models/interfaces/my-car';
import {forkJoin, map} from "rxjs";
import {BookingService} from "../../services/booking.service";
import {CarItemComponent} from "./car-item/car-item.component";
import {HeaderComponent} from "../../shared/header/header.component";
import {AuthService} from "../../services/auth.service";
import {
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective
} from "@coreui/angular";
import {FooterComponent} from "../../shared/footer/footer.component";
import { ErrorsService } from '../../services/errors.service';


// @ts-ignore
@Component({
  selector: 'app-my-car',
  standalone: true,
  imports: [
    FormsModule,

    NgIf,
    CarItemComponent,
    HeaderComponent,
    NgForOf,
    RouterLink,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    FooterComponent,
  ],
  templateUrl: './my-car.component.html',
  styleUrl: './my-car.component.css'
})
export class MyCarComponent implements OnInit {
  public sort: string = "";
  public status: string = "";
  public order: string = "";
  public cars: MyCar[];

  public page: number = 0;
  public totalPages: number;
  public totalElements: number = 0;

  constructor(private errorService: ErrorsService, private authService: AuthService, private route: Router, private carService: CarService, private bookingService: BookingService) {
    this.url = this.route.url;
  }

  public url: string;

  logout() {
    this.authService.logout(true);
  }

  ngOnInit(): void {
    this.getMyCars('no');
  }

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
    this.getMyCars('no');
  }

  getMyCars(type: string) {
    if (type == 'no')
      this.cars = [];
    this.carService.getCarDetailByOwner(this.sort, this.order, this.status, this.page).subscribe(
      (response: any) => {
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.createArray();
        for (let i = 0; i < response.content.length; i++) {
          var car: MyCar = {
            id: response.content[i].id,
            front:  response.content[i].carDetail.frontImgUrl,
            back:  response.content[i].carDetail.backImgUrl,
            left:  response.content[i].carDetail.leftImgUrl,
            right: response.content[i].carDetail.rightImgUrl,
            brand: response.content[i].brandModel.brand.name,
            model: response.content[i].brandModel.modelName,
            rating: response.content[i].rating,
            rides: response.content[i].noRides,
            price: response.content[i].carPricing.basePrice,
            transmission: response.content[i].transmission,
            seat: response.content[i].noSeat,
            mileage: response.content[i].carDetail.mileage,
            consumption: response.content[i].carDetail.fuelConsumption,
            deposit: response.content[i].carPricing.requiredDeposit,
            fuel: response.content[i].fuel,
            insurance_status: response.content[i].insuranceStatus,
            requests: 0,
            license: response.content[i].licensePlate,
            status: response.content[i].status,
            images: [response.content[i].carDetail.frontImgUrl,
               response.content[i].carDetail.backImgUrl,
              response.content[i].carDetail.leftImgUrl,
               response.content[i].carDetail.rightImgUrl],
            startDate: this.getDate(response.content[i].start),
            endDate: this.getDate(response.content[i].end),
            declinedReason: response.content[i].declinedReason
          }
          this.cars.push(car);
        }
        this.checkRequest(this.cars);
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

  getDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day.length < 2 ? "0" + day : day}/${month.length < 2 ? "0" + month : month}/${year}`;
  }

  checkRequest(cars: MyCar[]): void {
    forkJoin(
      cars.map(c =>
        this.bookingService.getNumberOfInprogressRequest(c.id).pipe(
          // map each Location to a cloned provider object
          map(response => {
            var resp: any = response;

            c.requests = resp;
          }))
      )
    ).subscribe(c => {
      // flatten the multi-dimensional array
      //  const updatedProviders = [].concat(...p);

    });
  }


  filter(type: string) {
    this.page = 0;
    if (type != "ALL")
      this.status = type;
    else
      this.status = "";
    var a = document.getElementById("dropdownRadioHelper");
    if (a != null) {
      a.classList.add("tw-hidden");
    }
    this.getMyCars('no');
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
      this.getMyCars('no');
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
      this.getMyCars('no');
    }

  }


  newTab() {
    window.open(this.route.createUrlTree(['/add-car'], { queryParams: { } }).toString(), '_blank');
    //this.route.navigate(['/add-car']);
  }
}
