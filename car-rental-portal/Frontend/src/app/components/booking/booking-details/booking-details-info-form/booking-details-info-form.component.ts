import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of, take, throttleTime } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { dateTimePickerConst } from '../../../../../environments/environment';
import { IBookingInfoStates } from '../../create-booking/store/booking.states';
import { BookingBasicInfo } from '../../../../models/entities/booking.model';
import {
  ILocationResp,
  LocationService,
} from '../../../../services/location.service';
import { BookingService } from '../../../../services/booking.service';
import { Location } from '../../../../models/interfaces/location';
import { displayErrorMessage } from '../../../../shared/messages/errorsMessage';
import { displaySuccessMessage } from '../../../../shared/messages/successMessage';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../../../models/entities/user.model';

@Component({
  styleUrl: './booking-details-info-form.component.scss',
  templateUrl: './booking-details-info-form.component.html',
  selector: 'booking-details-info-form',
})
export class ViewBookingDetailsInfoFormComponent implements OnInit, OnDestroy {
  isEditing: boolean = false;
  allowEditting: boolean = false;

  // driverLicenseImgUrl: string = '';

  bookingId: string = '';

  bookingServiceSubscription: Subscription;
  bookingInfoSubscription: Subscription;

  statusBooking: string = '';

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

  address: ILocationResp = {
    cityCode: '',
    cityName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardId: '',
    wardName: '',
  };

  bookingInfo: IBookingInfoStates = {
    carId: -1,
    driverInfo: new BookingBasicInfo(),
    pickUpCity: '',
    pickUpDate: new Date(),
    pickUpDistrict: '',
    pickUpStreet: '',
    pickUpWardId: '',
    renterInfo: new BookingBasicInfo(),
    returnDate: new Date(),
  };

  cities: Location[] = [];
  districts: Location[] = [];
  wards: Location[] = [];

  renterLicenseImg: string | ArrayBuffer = '';
  driverLicenseImg: string | ArrayBuffer = '';

  @ViewChild('citySelectionControl') citySelectionControl: HTMLSelectElement;
  @ViewChild('districtSelectionControl')
  districtSelectionControl: HTMLSelectElement;
  @ViewChild('wardSelectionControl') wardSelectionControl: HTMLSelectElement;
  @ViewChild('isDifferentCheckBox') isDriverDifferentCheckBox: HTMLInputElement;

  constructor(
    private readonly locationService: LocationService,
    private readonly bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private readonly userSerivce: UserService,
    private readonly router: Router,
    private userService: UserService,
  ) { }

  checkRenter() {

  }

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

  private curUser = new User();
  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userService.getUserInfoX().subscribe(
        (response: any) => {
          this.curUser.id = response.id;
          this.curUser.firstName = response.firstName;
          this.curUser.lastName = response.lastName;
          this.curUser.email = response.email;
          this.curUser.avatar = response.avatar;
          resolve(this.curUser);
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add an event listener for the 'load' event
    window.addEventListener('load', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    //get bookingId
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) => {
        if (params['bookingId'])
          this.bookingService.setBookingId(params['bookingId']);
      },
    });
    //get booking info by id
    this.bookingServiceSubscription = this.bookingService.bookingId$
      .pipe(throttleTime(5000))
      .subscribe({
        next: (bookingId) => {
          this.bookingInfoSubscription = this.bookingService
            .getBookingById(parseInt(bookingId))
            .subscribe({
              next: (bookingResp) => {
                console.log('resB', bookingResp);
                this.getUser().then(cu => {
                  if (cu) {
                    if (cu.id == bookingResp.userId) this.allowEditting = true;
                  } else {
                    this.allowEditting = false;
                  }
                }).catch(error => {
                  this.allowEditting = false;
                });
                this.statusBooking = bookingResp.status;
                //TODO: Fix this code to check that the booking is belong to the user or not
                // this.userSerivce.getUserInfo(localStorage.getItem('accessToken') ?? '').pipe(take(1)).subscribe({
                //   next: (userInfo) => {
                //     if(userInfo.email !== bookingResp.renterEmail)
                //       this.router.navigate(['/home']);
                //   },
                //   error: () => {
                //     displayErrorMessage('An error occurred!');
                //     this.router.navigate(['/home']);
                //   }
                // })

                this.renterLicenseImg = bookingResp.renterDriverLicenseImageUrl;
                this.driverLicenseImg = bookingResp.driverLicenseImageImageUrl;
                // this.bookingInfo.driverInfo.dob = bookingResp.driverDob;
                const renterDate = new Date(bookingResp.renterDob);
                this.renterDobDateStruct = {
                  day: renterDate.getDate(),
                  month: renterDate.getMonth() + 1,
                  year: renterDate.getFullYear(),
                };

                this.bookingInfo.driverInfo.email = bookingResp.driverEmail;
                this.bookingInfo.driverInfo.firstName =
                  bookingResp.driverFirstName;
                this.bookingInfo.driverInfo.lastName =
                  bookingResp.driverLastName;
                this.bookingInfo.driverInfo.nationalId =
                  bookingResp.driverNationalId;
                this.bookingInfo.driverInfo.phoneNumber =
                  bookingResp.driverPhone;
                this.bookingInfo.carId = bookingResp.carId;

                // this.bookingInfo.renterInfo.dob = bookingResp.renterDob;
                const driverDate = new Date(bookingResp.driverDob);
                this.driverDobDateStruct = {
                  day: driverDate.getDate(),
                  month: driverDate.getMonth() + 1,
                  year: driverDate.getFullYear(),
                };

                this.bookingInfo.renterInfo.email = bookingResp.renterEmail;
                this.bookingInfo.renterInfo.firstName =
                  bookingResp.renterFirstName;
                this.bookingInfo.renterInfo.lastName =
                  bookingResp.renterLastName;
                this.bookingInfo.renterInfo.nationalId =
                  bookingResp.renterNationalId;
                this.bookingInfo.renterInfo.phoneNumber =
                  bookingResp.renterPhone;
                this.bookingInfo.renterInfo.street = bookingResp.renterLocation;
                this.bookingInfo.renterInfo.ward = bookingResp.renterWardId.toString();

                this.bookingInfo.pickUpWardId =
                  bookingResp.pickUpWardId.toString();
                this.bookingInfo.pickUpStreet = bookingResp.pickUpLocation;
                this.bookingInfo.returnDate = bookingResp.returnDateTime;
                this.bookingInfo.pickUpDate = bookingResp.pickUpDateTime;

                this.renterLicenseImg = bookingResp.renterDriverLicenseImageUrl;
                this.driverLicenseImg = bookingResp.driverLicenseImageImageUrl;

                //getPickupLocation
                if (bookingResp.renterWardId && bookingResp.renterWardId !== 0)
                  this.locationService
                    .getLocationByWardId(bookingResp.renterWardId.toString())
                    .pipe(take(1))
                    .subscribe({
                      next: (addressResp: ILocationResp) => {
                        this.address = addressResp;
                        this.citySelectionControl.value = this.address.cityCode;
                        this.loadDistricts(this.citySelectionControl);
                        this.districtSelectionControl.value =
                          this.address.districtCode;
                        this.loadWards(
                          this.citySelectionControl,
                          this.districtSelectionControl
                        );
                        this.bookingInfo.renterInfo.ward = this.address.wardId;
                        this.wardSelectionControl.value = this.address.wardId;
                      },
                      error: () => {
                        displayErrorMessage('An error occurred!');
                      },
                    });
                //Check if driver info is renter info or not
                // if (
                //   this.bookingInfo.renterInfo.nationalId != this.bookingInfo.driverInfo.nationalId
                //   || this.bookingInfo.renterInfo.firstName != this.bookingInfo.driverInfo.firstName
                //   || this.bookingInfo.renterInfo.lastName != this.bookingInfo.driverInfo.lastName
                //   || this.bookingInfo.renterInfo.phoneNumber != this.bookingInfo.driverInfo.phoneNumber
                //   || this.bookingInfo.renterInfo.email != this.bookingInfo.driverInfo.email
                //   || this.compareTwoDates(this.bookingInfo.renterInfo.dob, this.bookingInfo.driverInfo.dob) !== 0
                // ) {
                //   this.driverIsDifferent = true;
                // } else {
                //   this.driverIsDifferent = false;
                // }

                if(this.bookingInfo.renterInfo.nationalId !== this.bookingInfo.driverInfo.nationalId)
                  this.driverIsDifferent = true;
                else 
                  this.driverIsDifferent = false;
                // console.log('check?', this.driverIsDifferent);
              },
            });
        },
      });

    this.getAllCitites();
  }

  compareTwoDates(date1: Date, date2: Date): number {
    // Remove the time part of the dates
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
    if (d1 < d2) {
      return -1; // date1 is earlier than date2
    } else if (d1 > d2) {
      return 1; // date1 is later than date2
    } else {
      return 0; // dates are equal
    }
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
      this.bookingInfo.renterInfo.city = city.value;
      this.getAllDistrictByCityCode(city.value);
    } else {
      this.districts = [];
      this.wards = [];
    }
    this.bookingInfo.renterInfo.district = '0';
    this.bookingInfo.renterInfo.ward = '0';
    this.districtSelectionControl.value = '0';
    this.wardSelectionControl.value = '0';
  }

  loadWards(city: HTMLSelectElement, district: HTMLSelectElement) {
    if (district.value !== '0' && city.value !== '0') {
      this.bookingInfo.renterInfo.district = district.value;
      this.getAllWardsByCityAndDistrictCode(city.value, district.value);
    } else {
      this.wards = [];
    }
    this.bookingInfo.renterInfo.ward = '0';
    this.wardSelectionControl.value = '0';
  }

  saveWard(ward: HTMLSelectElement) {
    this.bookingInfo.renterInfo.ward = ward.value;
  }

  toggleEditMode(isEditing: boolean) {
    if (!isEditing) {
      this.cancelEdit();
    }
  }


  cancelEdit() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to cancel? Any unsaved changes will be discarded.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, continue editing',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isEditing = false;
        window.location.reload();
      } else {
        this.isEditing = true;
      }
    });
  }

  onSubmit() {
    let renterDob: Date = new Date(this.renterDobDateStruct.day, this.renterDobDateStruct.month + 1, this.renterDobDateStruct.year);
    let driverDob: Date = new Date(this.driverDobDateStruct.day, this.driverDobDateStruct.month + 1, this.driverDobDateStruct.year);

    let driverDriverLicense: FormData = new FormData();
    let renterDriverLicense: FormData = new FormData();

    for (const [
      key,
      value,
    ] of this.bookingInfo.renterInfo.drivingLicense.entries()) {
      renterDriverLicense.append(key, value);
    }

    for (const [
      key,
      value,
    ] of this.bookingInfo.driverInfo.drivingLicense.entries()) {
      driverDriverLicense.append(key, value);
    }

    if (!this.driverIsDifferent) driverDriverLicense = renterDriverLicense;

    this.bookingService.bookingId$.pipe(take(1)).subscribe({
      next: (value) => {
        this.bookingId = value;
        this.bookingService
          .editBooking({
            carId: this.bookingInfo.carId,
            driverDob: new Date(this.driverDobDateStruct.year, this.driverDobDateStruct.month - 1, this.driverDobDateStruct.day),
            driverDriverLicense: driverDriverLicense,
            driverEmail: this.bookingInfo.driverInfo.email,
            driverFirstName: this.bookingInfo.driverInfo.firstName,
            driverLastName: this.bookingInfo.driverInfo.lastName,
            driverLocation: this.bookingInfo.driverInfo.street,
            driverNationalId: this.bookingInfo.driverInfo.nationalId,
            driverPhone: this.bookingInfo.driverInfo.phoneNumber,
            driverWardId: parseInt(this.address.wardId),
            id: parseInt(this.bookingId),
            pickUpDateTime: new Date(this.bookingInfo.pickUpDate),
            pickUpLocation: this.bookingInfo.pickUpStreet,
            pickUpWardId: parseInt(this.bookingInfo.pickUpWardId),
            renterDob: new Date(this.renterDobDateStruct.year, this.renterDobDateStruct.month - 1, this.renterDobDateStruct.day),
            renterDriverLicense: renterDriverLicense,
            renterEmail: this.bookingInfo.renterInfo.email,
            renterFirstName: this.bookingInfo.renterInfo.firstName,
            renterLastName: this.bookingInfo.renterInfo.lastName,
            renterLocation: this.bookingInfo.renterInfo.street,
            renterNationalId: this.bookingInfo.renterInfo.nationalId,
            renterPhone: this.bookingInfo.renterInfo.phoneNumber,
            renterWardId: parseInt(this.address.wardId),
            returnDateTime: new Date(this.bookingInfo.returnDate),
          })
          .pipe(take(1))
          .subscribe({
            next: () => {
              displaySuccessMessage('Edited successfully!');
              setTimeout(() => {
                window.location.reload();
              }, 1000)
            },
            error: () => {
              displayErrorMessage('An error occurred!');
            },
          });
      },
      error: () => {
        displayErrorMessage('An error occurred');
      },
    });
  }

  onCheckboxChange() {
    if (!this.driverIsDifferent) {
      this.bookingInfo.driverInfo = new BookingBasicInfo();
      let today = new Date();
      this.driverDobDateStruct = {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      };

      this.driverLicenseImg = '';
    } else {
      this.bookingInfo.driverInfo = this.bookingInfo.renterInfo;
      this.bookingInfo.driverInfo.drivingLicense = new FormData();

      for (let [
        key,
        value,
      ] of this.bookingInfo.renterInfo.drivingLicense.entries()) {
        this.bookingInfo.driverInfo.drivingLicense.append(key, value);
      }
      this.driverDobDateStruct = {
        day: this.renterDobDateStruct.day,
        month: this.renterDobDateStruct.month,
        year: this.renterDobDateStruct.year
      };
    }
    this.driverIsDifferent = !this.driverIsDifferent;
  }

  changeRenterUploadFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];

      this.bookingInfo.renterInfo.drivingLicense = new FormData();
      this.bookingInfo.renterInfo.drivingLicense.append('file', file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.renterLicenseImg = e.target.result;
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

  changeDriverUploadFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];

      this.bookingInfo.driverInfo.drivingLicense = new FormData();
      this.bookingInfo.driverInfo.drivingLicense.append('file', file);

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
    if (!dateStruct)
      return false;
    // console.log(dateStruct);

    let today: Date = new Date();
    let inputDate: Date = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    let differentTime: number = today.getTime() - inputDate.getTime();
    let ageDate: Date = new Date(differentTime);
    let age: number = ageDate.getUTCFullYear() - 1970;
    return age >= 18;
  }

  ngOnDestroy(): void { }
}
