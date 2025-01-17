import { Component, OnInit } from '@angular/core';
import { BookingItemComponent } from "./booking-item/booking-item.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { PendingBookingComponent } from "./pending-booking/pending-booking.component";
import { InProgressBookingComponent } from "./in-progress-booking/in-progress-booking.component";
import { CompletedBookingComponent } from "./completed-booking/completed-booking.component";
import { CarService } from "../../services/car.service";
import { FormsModule } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from "@angular/material/autocomplete";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { BookingService } from "../../services/booking.service";
import { AuthService } from '../../services/auth.service';

export interface Car {
  id: number,
  name: string,
  image: string
}

@Component({
  selector: 'app-car-booking',
  standalone: true,
  imports: [
    BookingItemComponent,
    HeaderComponent,
    NgIf,
    PendingBookingComponent,
    InProgressBookingComponent,
    CompletedBookingComponent,
    NgForOf,
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatOption,
    MatProgressSpinner,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.css',
  providers: [BookingService]
})
export class CarBookingComponent implements OnInit {
  public activeTab = 'Pending';

  public cars: Car[] = [];
  public carId: string[] = [];
  public totalPages: number = 0;
  public page: number = 0;

  url = '';
  constructor(
    private carService: CarService,
    private routeParams: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
    this.url = this.router.url;
  }

  logout() {
    this.authService.logout(true);
  }

  getCar() {
    this.carService.getCarDetailByOwner('', '', '', this.page).subscribe(
      (response: any) => {
        this.totalPages = response.totalPages;
        for (let i = 0; i < response.content.length; i++) {
          var car: Car = {
            id: response.content[i].id,
            image: response.content[i].carDetail.frontImgUrl,
            name: response.content[i].brandModel.brand.name + ' ' + response.content[i].brandModel.modelName
          }
          this.cars.push(car);
        }
      }
    )
  }

  ngOnInit(): void {

    this.routeParams.params.subscribe((params) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getCar();
      if (params['tab'] != null) {
        switch (params['tab']) {
          case 'Pending': {
            this.activeTab = 'Pending';
            break;
          }
          case 'Inprogress': {
            this.activeTab = 'Inprogress';
            break;
          }
          case 'Completed': {
            this.activeTab = 'Completed';
            break;
          }
        }
      }
      if (params['carId'] != null) {
        this.carId = [params['carId']];
        this.carService.getCarById(Number(params['carId'])).subscribe(
          (response: any) => {
            var a = document.getElementById("nmeCar");
            if (a != null) {
              console.log(a);
              a.textContent = response.brandModel.brand.name + ' ' + response.brandModel.modelName;
            }
          }
        )
      }
    });


  }


  changeActiveTab(tab: string) {
    this.activeTab = tab;
  }


  scroll() {
    var a = document.getElementById("dropdownCar");
    if (a != null) {
      if (a.scrollHeight - a.scrollTop - a.clientHeight <= 1) {
        if (this.page < this.totalPages - 1) {
          this.page++;
          this.getCar();
        }
      }
    }
  }
  oldActive: string = "";
  filterCar(id: number, name: string) {
    var a = document.getElementById("nmeCar");
    var b = document.getElementById(id.toString());
    if (b != null) {
      b.style.backgroundColor = "black";
      b.style.color = "white";
      if (this.oldActive != "") {
        var c = document.getElementById(this.oldActive);
        if (c != null && this.oldActive != id.toString()) {
          c.style.backgroundColor = "white";
          c.style.color = "black";
        }
      }
      this.oldActive = id.toString();
    }
    if (a != null) {
      a.textContent = name;
    }
    if (id != 0) {
      this.carId = [];
      this.carId.push(id.toString());
    } else {
      this.carId = [];
    }
  }

  show() {
    var ele = document.getElementById("dropdownCar");
    if (ele != null) {
      if (ele.classList.contains("tw-hidden")) {
        ele.classList.remove("tw-hidden");
      }
      else {
        ele.classList.add("tw-hidden");
      }
    }
  }
}
