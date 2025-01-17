import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/interfaces/user.interface';
import { Subscription, take } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { displaySuccessMessage } from '../../shared/messages/successMessage';
import { displayErrorMessage } from '../../shared/messages/errorsMessage';
import { ILocationResp, LocationService } from '../../services/location.service';
import { Location } from '../../models/interfaces/location';
import { ChangePasswordComponent } from '../authentication/change-password/change-password.component';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, TooltipModule } from '@coreui/angular';
import { STORAGE_TOKEN } from '../../constants/STORAGE-CONSTANT';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule, RouterLink, DatePickerComponent, ChangePasswordComponent,
    ModalComponent, ModalFooterComponent, ModalBodyComponent, ModalHeaderComponent, ReactiveFormsModule, TooltipModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

  isEditing: boolean = false;

  userId: string = '';

  user: User = {
    id: -1,
    avatar: new FormData,
    dob: new Date,
    email: '',
    firstName: '',
    lastName: '',
    noBooking: 0,
    phone: '',
    rating: 0,
    role: '',
    nationalId: '',
    address: '',
    wardId: 0,
    driverLicenseImage: new FormData
  };
  avatar: string;
  driverLicenseImage: string;

  dobDateStruct: NgbDateStruct = {
    day: 1,
    month: 2,
    year: 1990,
  };

  address: ILocationResp = {
    cityCode: '',
    cityName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardId: '',
    wardName: '',
  };

  cities: Location[] = [];
  districts: Location[] = [];
  wards: Location[] = [];

  @ViewChild('citySelectionControl') citySelectionControl: HTMLSelectElement;
  @ViewChild('districtSelectionControl')
  districtSelectionControl: HTMLSelectElement;
  @ViewChild('wardSelectionControl') wardSelectionControl: HTMLSelectElement;
  url = '';
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.url = this.router.url;
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('load', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    this.getMyProfile();
    this.getAllCitites();
  }

  getMyProfile() {
    var accessToken = localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);

    this.userService.getUserInfo(accessToken ?? '').subscribe(
      (data: any) => {
        this.user.id = data.id,
          this.avatar = data.avatar,
          this.user.firstName = data.firstName,
          this.user.lastName = data.lastName,
          this.user.email = data.email,
          this.user.phone = data.phone,
          this.user.rating = data.rating ?? 0,
          this.user.noBooking = data.noBooking ?? 0,
          this.user.role = data.role,
          this.user.nationalId = data.nationalId,
          this.user.address = data.address,
          this.user.wardId = data.wardId,
          this.driverLicenseImage = data.driverLicenseImage

        //getLocation
        if (data.wardId && data.wardId !== 0)
          this.locationService
            .getLocationByWardId(data.wardId.toString())
            .pipe(take(1))
            .subscribe({
              next: (addressResp: ILocationResp) => {
                this.citySelectionControl.value = addressResp.cityCode;
                this.loadDistricts(this.citySelectionControl);
                this.districtSelectionControl.value =
                  addressResp.districtCode;
                this.loadWards(
                  this.citySelectionControl,
                  this.districtSelectionControl
                );
                this.user.wardId = parseInt(addressResp.wardId);
                this.address.wardId = addressResp.wardId;
                this.wardSelectionControl.value = addressResp.wardId;
              },
              error: () => {
                displayErrorMessage('An error occurred!');
              },
            });


        this.user.dob = this.convertStringToDate(data.dob);
        this.dobDateStruct = this.convertJSDateToNgbDate(this.user.dob);
      });

  }

  logout() {
    this.authService.logout(true);
  }

  toggleEditMode(isEditing: boolean) {
    if (!isEditing) {
      this.cancelEdit();
    }
  }

  handleResult(result: string): void {
    this.dobDateStruct = this.convertDate(result);
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

  convertNgbDateToJSDate(dateStruct: NgbDateStruct): Date {
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
  }

  convertJSDateToNgbDate(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  convertStringToDate(dateString: string): Date {
    const parts = dateString.split('-');
    // Ensure the string is in the correct format
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Please provide a date string in "yyyy/MM/dd" format.');
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are zero-based
    const day = parseInt(parts[2], 10);

    // Check if the provided values make a valid date
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date values.');
    }

    return new Date(year, month, day);
  }

  checkValidDob(dateStruct: NgbDateStruct): boolean {
    if (!dateStruct)
      return false;

    let today: Date = new Date();
    let inputDate: Date = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    let differentTime: number = today.getTime() - inputDate.getTime();
    let ageDate: Date = new Date(differentTime);
    let age: number = ageDate.getUTCFullYear() - 1970;
    return age >= 18;
  }

  changeAvatarFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];

      console.log($event)

      this.user.avatar = new FormData();
      this.user.avatar.append('file', file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatar = e.target.result;
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

  changeDriverLicenseFile($event: any) {
    if ($event.target.files[0].type == "image/jpeg" || $event.target.files[0].type == "image/jpg" || $event.target.files[0].type == "image/png") {
      const file = $event.target.files[0];
      console.log($event)
      this.user.driverLicenseImage = new FormData();
      this.user.driverLicenseImage.append('file', file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.driverLicenseImage = e.target.result;
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
      this.address.cityCode = city.value;
      this.getAllDistrictByCityCode(city.value);
    } else {
      this.districts = [];
      this.wards = [];
    }
    this.address.districtCode = '0';
    this.address.wardId = '0';
    this.districtSelectionControl.value = '0';
    this.wardSelectionControl.value = '0';
  }

  loadWards(city: HTMLSelectElement, district: HTMLSelectElement) {
    if (district.value !== '0' && city.value !== '0') {
      this.address.districtCode = district.value;
      this.getAllWardsByCityAndDistrictCode(city.value, district.value);
    } else {
      this.wards = [];
    }
    this.address.wardId = '0';
    this.wardSelectionControl.value = '0';
  }

  saveWard(ward: HTMLSelectElement) {
    this.address.wardId = ward.value;
    this.user.wardId = parseInt(this.address.wardId);
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
    let avatar: FormData = new FormData();
    let driverLicenseImage: FormData = new FormData();

    for (const [
      key,
      value,
    ] of this.user.avatar.entries()) {
      avatar.append(key, value);
    }

    for (const [
      key,
      value,
    ] of this.user.driverLicenseImage.entries()) {
      driverLicenseImage.append(key, value);
    }

    this.user.dob = this.convertNgbDateToJSDate(this.dobDateStruct);

    this.userService.editProfile({
      id: this.user.id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      dob: new Date(this.user.dob),
      email: this.user.email,
      phone: this.user.phone,
      noBooking: this.user.noBooking,
      rating: this.user.rating,
      avatar: avatar,
      role: this.user.role,
      nationalId: this.user.nationalId,
      address: this.user.address,
      wardId: this.user.wardId,
      driverLicenseImage: driverLicenseImage
    }).pipe(take(1))
      .subscribe({
        next: () => {
          this.storageService.remove('userInfo');
          displaySuccessMessage('Edited successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        },
        error: () => {
          displayErrorMessage('An error occurred!');
        },
      });

  }

}
