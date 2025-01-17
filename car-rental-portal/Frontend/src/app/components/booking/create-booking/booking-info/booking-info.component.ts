import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Location } from '../../../../models/interfaces/location';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookingBasicInfo } from '../../../../models/entities/booking.model';
import { LocationService } from '../../../../services/location.service';
import { User } from '../../../../models/entities/user.model';
import { dateTimePickerConst } from '../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { changeBookingInfo } from '../store/booking.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookingInfoStates } from '../store/booking.states';
import { FormBuilder } from '@angular/forms';
import { BookingService } from '../../../../services/booking.service';
import { UserBookingInfo } from '../../../../models/interfaces/booking.interface';

import { selectBookingInfo, } from '../store/booking.selectors';
import { Subscription, take } from 'rxjs';
import { displayErrorMessage } from '../../../../shared/messages/errorsMessage';
import { CarService } from '../../../../services/car.service';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { STORAGE_TOKEN } from '../../../../constants/STORAGE-CONSTANT';

@Component({
  selector: 'booking-info',
  styleUrl: './booking-info.component.scss',
  templateUrl: 'booking-info.component.html',
})
export class BookingInfoComponent implements OnInit {
  dateTimePickerConst = dateTimePickerConst;

  renterDobDateStruct: NgbDateStruct = {
    day: 1,
    month: 2,
    year: 1990,
  };
  driverDobDateStruct: NgbDateStruct = {
    day: 1,
    month: 2,
    year: 1990,
  };

  driverIsDifferent: boolean = false;
  userBookingInfo: UserBookingInfo;

  cities: Location[] = [];
  districts: Location[] = [];
  wards: Location[] = [];

  renterLicenseImg: string | ArrayBuffer;
  driverLicenseImg: string | ArrayBuffer;

  userInfo: User;

  @ViewChild('districtSelectionControl')
  districtSelectionControl: HTMLSelectElement;
  @ViewChild('wardSelectionControl') wardSelectionControl: HTMLSelectElement;
  @ViewChild('renterLicenseControl')
  renterLicenseControl: ElementRef;
  @ViewChild('driverLicenseControl')
  driverLicenseControl: ElementRef;

  constructor(
    private readonly locationService: LocationService,
    private store: Store<any>,
    private router: Router,
    private readonly bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private carService: CarService,
    private userService: UserService
  ) { }

  handleResultRenter(result: string): void {
    // console.log('date: ', result); // Output the result to the console or use it as needed
    this.renterDobDateStruct = this.convertDate(result);
    // console.log('r: ', this.renterDobDateStruct);
  }

  handleResultDriver(result: string): void {
    // console.log('date: ', result); // Output the result to the console or use it as needed
    this.driverDobDateStruct = this.convertDate(result);
  }

  convertDate(dateString: string): NgbDateStruct {
    // Split the date string into day, month, and year parts
    const parts = dateString.split('/');

    // Extract day, month, and year from the parts array
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Create and return NgbDateStruct object
    const ngbDate: NgbDateStruct = { day, month, year };
    return ngbDate;
  }

  convertToString(date: NgbDateStruct): string {
    // Extract day, month, and year from the NgbDateStruct object
    const day = date.day.toString().padStart(2, '0');
    const month = date.month.toString().padStart(2, '0');
    const year = date.year.toString();

    // Concatenate day, month, and year with '/' separator
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add an event listener for the 'load' event
    window.addEventListener('load', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    //get user info
    this.userService.getUserInfo(localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY) ?? '').pipe(take(1)).subscribe({
      next: (userInfoResp) => {
        this.userInfo = userInfoResp;
      }
    })
    //check if the car id param is existed or not
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) => {
        if (
          !params['carId'] ||
          !params['pickUpDate'] ||
          !params['returnDate'] ||
          !params['city'] ||
          !params['district'] ||
          !params['ward']
        ) {
          displayErrorMessage('An error occurred');
          this.router.navigate(['/home']);
        } else {
          //check if the user belong to the car or not
          this.carService.getCarById(params['carId']).pipe(take(1)).subscribe({
            next: (carInfo) => {
              if (carInfo.profileDto.ownerId === this.userInfo.id) {
                displayErrorMessage('Error: You can\'t create booking with your own car');
                this.router.navigate(['/home']);
              }
            }
          })

          this.store
            .select(selectBookingInfo)
            .pipe(take(1))
            .subscribe({
              next: (value) => {
                let output: IBookingInfoStates = {
                  carId: Number.parseInt(params['carId']),
                  pickUpCity: params['city'],
                  pickUpDistrict: params['district'],
                  pickUpWardId: params['ward'],
                  pickUpStreet: decodeURIComponent(params['street']) ?? '',
                  pickUpDate: this.bookingService.convertStringToDate(
                    params['pickUpDate']
                  ),
                  returnDate: this.bookingService.convertStringToDate(
                    params['returnDate']
                  ),
                  driverInfo: value.driverInfo,
                  renterInfo: value.renterInfo,
                };

                this.store.dispatch(changeBookingInfo(output));
              },
              error: (error) => {
                displayErrorMessage('An error occurred!');
              },
            });
        }
      },
      error: (error) => {
        displayErrorMessage('An error occurred!');
        this.router.navigate(['/home']);
      },
    });

    this.userBookingInfo = {
      renterInfo: new BookingBasicInfo(),
      driverInfo: new BookingBasicInfo(),
    };

    this.getAllCitites();
  }

  getAllCitites() {
    this.locationService
      .getAllCities()
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          for (let i = 0; i < resp.length; i++) {
            let location: Location = {
              id: resp[i].id,
              code: resp[i].cityCode,
              name: resp[i].cityName,
            };
            this.cities.push(location);
          }
        },
      });
  }

  getAllDistrictByCityCode(cityCode: string) {
    this.districts = [];
    this.locationService
      .getAllDistrictsByCityCode(cityCode)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          for (let i = 0; i < resp.length; i++) {
            let location: Location = {
              id: resp[i].id,
              code: resp[i].districtCode,
              name: resp[i].districtName,
            };
            this.districts.push(location);
          }
        },
      });
  }

  getAllWardsByCityAndDistrictCode(cityCode: string, districtCode: string) {
    this.wards = [];
    this.locationService
      .getAllWardsByCityCodeAndDistrictCode(cityCode, districtCode)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          for (let i = 0; i < resp.length; i++) {
            let location: Location = {
              id: resp[i].id,
              code: resp[i].wardCode,
              name: resp[i].wardName,
            };
            this.wards.push(location);
          }
        },
      });
  }

  loadDistricts(city: HTMLSelectElement) {
    if (city.value !== '0') {
      this.userBookingInfo.renterInfo.city = city.value;
      this.getAllDistrictByCityCode(city.value);
    } else {
      this.districts = [];
      this.wards = [];

    }
    this.userBookingInfo.renterInfo.district = '0';
    this.userBookingInfo.renterInfo.ward = '0';
    this.districtSelectionControl.value = '0';
    this.wardSelectionControl.value = '0';
  }

  loadWards(city: HTMLSelectElement, district: HTMLSelectElement) {
    if (district.value !== '0' && city.value !== '0') {
      this.userBookingInfo.renterInfo.district = district.value;
      this.getAllWardsByCityAndDistrictCode(city.value, district.value);
    } else {
      this.wards = [];
    }
    this.userBookingInfo.renterInfo.ward = '0';
    this.wardSelectionControl.value = '0';
  }

  saveWard(ward: HTMLSelectElement) {
    this.userBookingInfo.renterInfo.ward = ward.value;
  }

  clearFields() {
    this.userBookingInfo.renterInfo.firstName = '';
    this.userBookingInfo.renterInfo.lastName = '';
    this.userBookingInfo.renterInfo.email = '';
    this.userBookingInfo.renterInfo.phoneNumber = '';
    this.userBookingInfo.renterInfo.nationalId = '';
    this.userBookingInfo.renterInfo.drivingLicense.delete('file');
    this.renterLicenseControl.nativeElement.value = '';
    this.renterLicenseImg = '';

    this.userBookingInfo.renterInfo.city = '0';
    this.userBookingInfo.renterInfo.district = '0';
    this.userBookingInfo.renterInfo.ward = '0';
    this.userBookingInfo.renterInfo.street = '';

    this.userBookingInfo.driverInfo.firstName = '';
    this.userBookingInfo.driverInfo.lastName = '';
    this.userBookingInfo.driverInfo.email = '';
    this.userBookingInfo.driverInfo.phoneNumber = '';
    this.userBookingInfo.driverInfo.nationalId = '';
    this.userBookingInfo.driverInfo.drivingLicense.delete('file');
    this.driverLicenseControl.nativeElement.value = '';
    this.driverLicenseImg = '';
  }

  onSubmit() {
    let pickUpWardId: string = '';
    let pickUpStreet: string = '';
    let carId: number = -1;
    let pickUpCity: string = '';
    let pickUpDistrict: string = '';
    let pickUpDate = new Date();
    let returnDate = new Date();

    this.store
      .select(selectBookingInfo)
      .pipe(take(1))
      .subscribe({
        next: (bookingInfo) => {
          pickUpWardId = bookingInfo.pickUpWardId;
          pickUpStreet = bookingInfo.pickUpStreet;
          carId = bookingInfo.carId;
          pickUpCity = bookingInfo.pickUpCity;
          pickUpDistrict = bookingInfo.pickUpDistrict;
          returnDate = new Date(bookingInfo.returnDate);
          pickUpDate = new Date(bookingInfo.pickUpDate);
          let renterDob = new Date(
            this.renterDobDateStruct.year,
            this.renterDobDateStruct.month - 1,
            this.renterDobDateStruct.day
          );
          let driverDob: Date = new Date();

          if (this.driverIsDifferent) {
            driverDob = new Date(
              this.driverDobDateStruct.year,
              this.driverDobDateStruct.month - 1,
              this.driverDobDateStruct.day
            );
          } else {
            driverDob = renterDob;
          }

          this.userBookingInfo.driverInfo.dob = driverDob;
          this.userBookingInfo.renterInfo.dob = renterDob;

          let output: IBookingInfoStates = {
            renterInfo: this.userBookingInfo.renterInfo,
            driverInfo: this.userBookingInfo.driverInfo,
            pickUpCity: pickUpCity,
            pickUpDistrict: pickUpDistrict,
            pickUpDate: pickUpDate,
            returnDate: returnDate,
            pickUpWardId: pickUpWardId,
            pickUpStreet: pickUpStreet,
            carId: carId,
          };

          //Check if the renter is the driver or not
          if (!this.driverIsDifferent) {
            output.driverInfo = output.renterInfo;
            this.driverDobDateStruct = this.renterDobDateStruct;
          }

          this.driverLicenseImg = '';

          //set driver location to renter location
          output.driverInfo.city = output.renterInfo.city;
          output.driverInfo.district = output.driverInfo.district;
          output.driverInfo.ward = output.driverInfo.ward;

          this.store.dispatch(changeBookingInfo(output));

          this.bookingService.createBooking({
            carId: output.carId,
            id: null,
            driverInfo: output.driverInfo,
            renterInfo: output.renterInfo,
            pickUpDateTime: output.pickUpDate,
            returnDateTime: output.returnDate,
            pickUpWardId: output.pickUpWardId,
            pickUpStreet: output.pickUpStreet,
          });
        },
      });
  }

  onCheckboxChange() {
    //check if the driver is different or not
    if (!this.driverIsDifferent) {
      this.userBookingInfo.driverInfo = new BookingBasicInfo();
      let today: Date = new Date();
      this.driverDobDateStruct = {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      };
    } else {
      this.userBookingInfo.driverInfo = this.userBookingInfo.renterInfo;
      this.userBookingInfo.driverInfo.drivingLicense = new FormData();
      //import renterInfo for driver
      for (let [
        key,
        value,
      ] of this.userBookingInfo.renterInfo.drivingLicense.entries()) {
        this.userBookingInfo.driverInfo.drivingLicense.append(key, value);
      }
    }
    this.driverDobDateStruct = this.renterDobDateStruct;
    this.driverIsDifferent = !this.driverIsDifferent;
  }

  changeRenterUploadFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];
      //check if the file is null or not
      if (file) {
        this.userBookingInfo.renterInfo.drivingLicense = new FormData();
        this.userBookingInfo.renterInfo.drivingLicense.append('file', file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.renterLicenseImg = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.userBookingInfo.renterInfo.drivingLicense = new FormData();
        this.renterLicenseImg = '';
      }
    } else {
      Swal.fire({
        title: 'Confirmation',
        html: 'Please input an image',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'No',
        confirmButtonColor: '#007bff',
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
  }

  changeDriverUploadFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];

      this.userBookingInfo.driverInfo.drivingLicense = new FormData();
      this.userBookingInfo.driverInfo.drivingLicense.append('file', file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.driverLicenseImg = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        title: 'Confirmation',
        html: 'Please input an image',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'No',
        confirmButtonColor: '#007bff',
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
  }

  checkValidDob(dateStruct: NgbDateStruct): boolean {
    //check if the dateStruct null or not
    if (!dateStruct)
      return false;

    // //check if the dateStruct is equal to default value or not
    // if(dateStruct.day === 1 && dateStruct.month === 2 && dateStruct.year === 1990)
    //   return false;

    let today: Date = new Date();
    let inputDate: Date = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    let differentTime: number = today.getTime() - inputDate.getTime();
    let ageDate: Date = new Date(differentTime);
    let age: number = ageDate.getUTCFullYear() - 1970;
    return age >= 18;
  }
}
