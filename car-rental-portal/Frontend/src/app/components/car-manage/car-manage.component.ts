import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarItemComponent } from './car-item/car-item.component';
import { CarService } from '../../services/car.service';
import { MyCar } from '../../models/interfaces/my-car';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ErrorsService } from '../../services/errors.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-manage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule, CarItemComponent, FormsModule],
  templateUrl: './car-manage.component.html',
  styleUrl: './car-manage.component.css'
})
export class CarManageComponent implements OnInit {
  getSearchInput() {
    this.page = 0;
    this.getAllApprovalCars();
  }
  ngOnInit(): void {
    this.getAllApprovalCars();
  }

  constructor(private carService: CarService,
    private authService: AuthService,
    private route: Router,
    private errorService: ErrorsService) {
      this.url = this.route.url;
  }
  public arr: number[] = [1, 2, 3];

  public arrPage: number[] = [];

  public totalPages: number = 0;

  public totalElements: number = 0;

  public results: MyCar[];

  public page = 0;

  public size = 5;

  public searchInput: string = "";

  switchPage(p: number) {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getAllApprovalCars();
  }

  getDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day.length < 2 ? "0" + day : day}/${month.length < 2 ? "0" + month : month}/${year}`;
  }

  logout() {
    this.authService.logout(true);
  }

  public url: string;

  getAllApprovalCars() {
    this.carService.getAllWaitForApprovalCars(this.page, this.size, this.searchInput).subscribe(
      (response: any) => {
        this.arrPage = [];
        this.results = [];
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        for (let i = 0; i < response.totalPages; i++) {
          this.arrPage.push(i + 1);
        }
        for (let i = 0; i < response.content.length; i++) {

          var car: MyCar = {
            id: response.content[i].id,
            front: response.content[i].carDetail.frontImgUrl,
            back: response.content[i].carDetail.backImgUrl,
            left: response.content[i].carDetail.leftImgUrl,
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
            ownerId: response.content[i].profileDto.ownerId,
            ownerName: response.content[i].profileDto.firstName + ' ' + response.content[i].profileDto.lastName,
            ownerPhone: response.content[i].profileDto.phone,
            ownerEmail: response.content[i].profileDto.email,
            ownerAvatar: response.content[i].profileDto.avatar == null || response.content[i].profileDto.avatar == undefined || response.content[i].profileDto.avatar == '' ? ('assets/images/avatar/avatar1.png') : response.content[i].profileDto.avatar,
            road: response.content[i].carLocations[0].ward.district.city.cityName + ', ' +
              response.content[i].carLocations[0].ward.district.districtName + ', ' +
              response.content[i].carLocations[0].ward.wardName +
              (response.content[i].carLocations[0].road != null && response.content[i].carLocations[0].road != undefined && response.content[i].carLocations[0].road != '' ? (', ' +
                response.content[i].carLocations[0].road) : ('')),
            createdAt: response.content[i].createdAt != null ? this.getDate(response.content[i].createdAt) : '',
            updatedAt: response.content[i].updatedAt != null ? this.getDate(response.content[i].updatedAt) : "Not updated yet"
          }
          this.results.push(car);
          // this.sortArr(this.results, carBasic);
        }
      },
      (error: HttpErrorResponse) => {
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
}
