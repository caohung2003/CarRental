import {Component, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription, take, throttleTime} from 'rxjs';
import {NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, NgModel} from '@angular/forms';
import {dateTimePickerConst} from '../../../../environments/environment';
import {IBookingInfoStates} from '../../../components/booking/create-booking/store/booking.states';
import {BookingBasicInfo} from '../../../models/entities/booking.model';
import {ILocationResp, LocationService,} from '../../../services/location.service';
import {BookingService} from '../../../services/booking.service';
import {CarService} from '../../../services/car.service';
import {Location} from '../../../models/interfaces/location';
import {displayErrorMessage} from '../../messages/errorsMessage';
import {displaySuccessMessage} from '../../messages/successMessage';
import {CommonModule} from '@angular/common';
import {NgbDateCustomerParserFormatter} from '../../../services/NgbDateCustomParserFormatter.service';
import {HeaderComponent} from '../../header/header.component';
import {DatePickerComponent} from '../date-picker/date-picker.component';

@Component({
  styleUrl: './booking-detail.component.css',
  templateUrl: './booking-detail.component.html',
  selector: 'app-booking-detail',
  providers: [BookingService,CarService,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateCustomerParserFormatter,
    }],
  standalone: true,
  imports: [FormsModule, CommonModule, NgbDatepickerModule, HeaderComponent, DatePickerComponent]
})
export class BookingDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = false;

  // driverLicenseImgUrl: string = '';

  bookingId: string = '';

  bookingServiceSubscription: Subscription;
  bookingInfoSubscription: Subscription;

  dateTimePickerConst = dateTimePickerConst;

  renterDobDateStruct: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 1990,
  };
  driverDobDateStruct: NgbDateStruct = {
    day: 1,
    month: 1,
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
  @ViewChild('isDifferentCheckBox') isDriverDifferentCheckBox: NgModel;

  constructor(
      private readonly locationService: LocationService,
      private readonly bookingService: BookingService,
      private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
                    this.renterLicenseImg = bookingResp.renterDriverLicenseImageUrl;
                    this.driverLicenseImg = bookingResp.driverLicenseImageImageUrl;
                    // this.bookingInfo.driverInfo.dob = bookingResp.driverDob;
                    const renterDate = new Date(bookingResp.renterDob);
                    this.renterDobDateStruct = {
                      day: renterDate.getDay(),
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
                      day: driverDate.getDay(),
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

                    this.bookingInfo.pickUpWardId =
                        bookingResp.pickUpWardId.toString();
                    this.bookingInfo.pickUpStreet = bookingResp.pickUpLocation;
                    this.bookingInfo.returnDate = bookingResp.returnDateTime;
                    this.bookingInfo.pickUpDate = bookingResp.pickUpDateTime;

                    this.renterLicenseImg = bookingResp.renterDriverLicenseImageUrl;
                    this.driverLicenseImg = bookingResp.driverLicenseImageImageUrl;

                    //getPickupLocation
                    if (this.bookingInfo.pickUpWardId !== '')
                      this.locationService
                          .getLocationByWardId(this.bookingInfo.pickUpWardId)
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
                              this.wardSelectionControl.value = this.address.wardId;
                            },
                            error: () => {
                              displayErrorMessage('An error occurred!');
                            },
                          });
                    //Check if driver info is renter info or not
                    if (
                        JSON.stringify(this.bookingInfo.driverInfo) !==
                        JSON.stringify(this.bookingInfo.renterInfo)
                    ) {
                      this.driverIsDifferent = false;
                    }
                  },
                });
          },
        });

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
      this.bookingInfo.renterInfo.city = city.value;
      this.getAllDistrictByCityCode(city.value);
    } else {
      this.districts = [];
      this.wards = [];
    }
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
    this.wardSelectionControl.value = '0';
  }

  saveWard(ward: HTMLSelectElement) {
    this.bookingInfo.renterInfo.ward = ward.value;
  }

  onCancel() {
    console.log('On cancel!');
    //Dialog popup to recheck
    //Navigate to home if user choose 'yes'
  }

  onSubmit() {
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

    if (this.driverIsDifferent) driverDriverLicense = renterDriverLicense;

    let output: IBookingInfoStates = {
      renterInfo: this.bookingInfo.renterInfo,
      driverInfo: this.bookingInfo.driverInfo,
      pickUpCity: this.bookingInfo.pickUpCity,
      pickUpDistrict: this.bookingInfo.pickUpDistrict,
      pickUpDate: this.bookingInfo.pickUpDate,
      returnDate: this.bookingInfo.returnDate,
      pickUpWardId: this.bookingInfo.pickUpWardId,
      pickUpStreet: this.bookingInfo.pickUpStreet,
      carId: this.bookingInfo.carId,
    };

    //Check if the renter is the driver or not
    if (!this.driverIsDifferent) {
      output.driverInfo = output.renterInfo;
      this.driverDobDateStruct = this.renterDobDateStruct;
    }

    output.renterInfo.dob = new Date(
        this.renterDobDateStruct.year,
        this.renterDobDateStruct.month - 1,
        this.renterDobDateStruct.day
    );

    output.driverInfo.dob = new Date(
        this.driverDobDateStruct.year,
        this.driverDobDateStruct.month - 1,
        this.driverDobDateStruct.day
    );

    this.bookingService.bookingId$.pipe(take(1)).subscribe({
      next: (value) => {
        this.bookingId = value;
        this.bookingService
            .editBooking({
              carId: output.carId,
              driverDob: new Date(this.bookingInfo.driverInfo.dob),
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
              renterDob: new Date(this.bookingInfo.renterInfo.dob),
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
        day: today.getDay(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      };
    } else {
      this.bookingInfo.driverInfo = this.bookingInfo.renterInfo;
      this.bookingInfo.driverInfo.drivingLicense = new FormData();

      for (let [
        key,
        value,
      ] of this.bookingInfo.renterInfo.drivingLicense.entries()) {
        this.bookingInfo.driverInfo.drivingLicense.append(key, value);
      }
      this.driverDobDateStruct = this.renterDobDateStruct;
    }
    this.driverIsDifferent = !this.driverIsDifferent;
  }

  changeRenterUploadFile($event: any) {
    const file = $event.target.files[0];

    this.bookingInfo.renterInfo.drivingLicense = new FormData();
    this.bookingInfo.renterInfo.drivingLicense.append('file', file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.renterLicenseImg = e.target.result;

    };
    reader.readAsDataURL(file);
    // console.log('okela');
    // console.log(this.renterLicenseImg);
  }

  changeDriverUploadFile($event: any) {
    const file = $event.target.files[0];

    this.bookingInfo.driverInfo.drivingLicense = new FormData();
    this.bookingInfo.driverInfo.drivingLicense.append('file', file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.driverLicenseImg = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {}
}

