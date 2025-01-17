import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { StepperComponent } from "./stepper/stepper.component";
import { FormCarBasicComponent } from "./form-car-basic/form-car-basic.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { Router, RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { FooterComponent } from "../../shared/footer/footer.component";
import { StmtpComponent } from "../../shared/components/stmtp/stmtp.component";
import { FormCarDetailComponent } from "./form-car-detail/form-car-detail.component";
import { FormCarBasic } from "../../models/interfaces/form-carbasic";
import { FormCarDetail } from "../../models/interfaces/form-cardetail";
import { FormCarPricingComponent } from "./form-car-pricing/form-car-pricing.component";
import { FormCarCalendarComponent } from "./form-car-calendar/form-car-calendar.component";
import { FormCarPricing } from "../../models/interfaces/form-carpricing";
import { FormCarCalendar } from "../../models/interfaces/form-carcalendar";
import { DateRangeComponent } from "../../shared/components/date-range/date-range.component";
import { CarService } from "../../services/car.service";
import { ErrorsService } from "../../services/errors.service";
import { FormCarLocation } from "../../models/interfaces/form-carlocation";
import { initFlowbite } from "flowbite";
import { CarBusyCalendar } from '../../models/interfaces/car-busy-calendar';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ApproveStepComponent } from './approve-step/approve-step.component';


@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [
    StepperComponent,
    FormCarBasicComponent,
    HeaderComponent,
    RouterLink,
    NgIf,
    FooterComponent,
    StmtpComponent,
    FormsModule,
    FormCarDetailComponent,
    FormCarPricingComponent,
    FormCarCalendarComponent,
    DateRangeComponent,
    ApproveStepComponent
  ],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent implements OnInit, OnChanges {
  redirectToProfile() {
    this.route.navigate(['/profile/' + this.ownerId]);
  }

  isLoading = true;
  formatDateToString(date: string): string {
    var s = date.split('T');
    var result: string = '';
    for (var i = 0; i < s.length; i++) {
      if (i == 0) {
        var arr: string[] = s[i].split('-');
        result += (arr[2] + "-" + arr[1] + "-" + arr[0]);
        result += " ";
      }
      else {
        var arr: string[] = s[i].split(':');
        result += (arr[0] + ":" + arr[1]);
      }
    }
    return result;
  }
  getDisplayCarlendarString(calendars: any[]): string[] {
    var arr: string[] = [];
    for (var i = 0; i < calendars.length; i++) {
      if (calendars[i].busyReason == 'OWN_REASONS') {
        var result = this.formatDateToString(calendars[i].start);
        result += " to ";
        result += this.formatDateToString(calendars[i].end);
        arr.push(result);
      }
    }
    return arr;
  }
  getDisplayCarlendarInterface(calendars: any[]): CarBusyCalendar[] {
    var arr: CarBusyCalendar[] = [];
    for (var i = 0; i < calendars.length; i++) {
      if (calendars[i].busyReason == 'OWN_REASONS') {
        var carBusy: CarBusyCalendar = {
          start: calendars[i].start,
          end: calendars[i].end,
          reason: calendars[i].busyReason,
          bookingId: calendars[i].bookingId
        }
        arr.push(carBusy);
      }
    }
    return arr;
  }

  getAllDisplayCarlendarInterface(calendars: any[]): CarBusyCalendar[] {
    var arr: CarBusyCalendar[] = [];
    for (var i = 0; i < calendars.length; i++) {
      var carBusy: CarBusyCalendar = {
        start: calendars[i].start,
        end: calendars[i].end,
        reason: calendars[i].busyReason,
        bookingId: calendars[i].bookingId
      }
      arr.push(carBusy);

    }
    return arr;
  }
  public isNeededApproval: boolean = false;
  getCar() {

    this.carService.getCarDetailResponseByOwner(this.id).subscribe(
      (response: any) => {
        if (response.status == 'WAIT_FOR_APPROVAL') {
          this.isNeededApproval = true;
        }
        var functions: string[] = [];
        var terms: string[] = [];
        var termsId: number[] = [];
        for (let i = 0; i < response.features.length; i++) {
          if (response.features[i].featureType == 'Function') {
            functions.push(response.features[i].featureName);
          } else if (response.features[i].featureType == 'Term') {
            terms.push(response.features[i].featureName);
            termsId.push(response.features[i].id);
          }
        }
        this.formCarBasic = {
          carId: response.id,
          licensePlate: response.licensePlate,
          modelId: response.brandModel.id,
          brandId: response.brandModel.brand.id,
          yearProduction: response.yearProduction,
          seat: response.noSeat,
          transmission: response.transmission.substring(0, 1) + response.transmission.substring(1).toLowerCase(),
          fuel: response.fuel.substring(0, 1) + response.fuel.substring(1).toLowerCase(),
          function: functions,
          consumption: response.fuelConsumption,
          description: response.description
        }
        this.formCarPricing = {
          deposit: response.requiredDeposit,
          basePrice: response.basePrice,
          termsString: terms,
          terms: termsId,
          priceMethod: response.basePriceMethod
        }
        var formCarLocation: FormCarLocation = {
          road: response.carLocations[0].road != undefined ? response.carLocations[0].road : '',
          lat: response.carLocations[0].lat,
          lng: response.carLocations[0].lng,
          wardId: response.carLocations[0].ward.id,
        }
        this.formCarDetail = {
          mileage: response.mileage,
          location: [formCarLocation],
          road: response.carLocations[0].road,
          rightImgFile: '',
          leftImgFile: '',
          backImgFile: '',
          frontImgFile: '',
          leftUrl: response.leftImgUrl,
          rightUrl: response.rightImgUrl,
          backUrl: response.backImgUrl,
          frontUrl: response.frontImgUrl,
          insuranceUrl: response.insuranceImgUrl,
          registrationUrl: response.registrationImgUrl,
          inspectionUrl: response.inspectionImgUrl,
          timeCancelPendingDeposit: response.autoCancelHoursAfterConfirmation,
          timeCancelPending: response.autoCancelHoursAfterPending,
          insuranceImgFile: '',
          inspectionImgFile: '',
          registrationImgFile: ''
        }
        this.formCarCalendar = {
          startRent: response.startRent,
          endRent: response.endRent,
          carBusys: this.getDisplayCarlendarInterface(response.carCalendar),
          listDisplay: this.getDisplayCarlendarString(response.carCalendar),
          rentTime: 3,
          allBusys: this.getAllDisplayCarlendarInterface(response.carCalendar)
        }
        this.ownerAvatar = response.owner.avatar == null || response.owner.avatar == undefined || response.owner.avatar == '' ? ('assets/images/avatar/avatar1.png') : response.owner.avatar;
        this.ownerName = response.owner.firstName + ' ' + response.owner.lastName;
        this.ownerEmail = response.owner.email;
        this.ownerTel = response.owner.phone;
       this.ownerId = response.owner.ownerId;
        initFlowbite();
        this.isLoading = false;

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


  public ownerId: number;
  public isEditing = false;

  toggleEditMode() {

    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.cancelEdit();
    }
    else {
      this.mode = 'edit';
    }
  }

  declinedReason: string = '';
  decline() {
    Swal.fire({
      title: 'Confirmation',
      html: `Are you sure you want to decline this car ? Please give us your reasons <br/><input id = "reason" style = "margin-top: 20px; width: 90%; border-radius: 10px" class="input" type="text" required placeholder="Reason...">`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No',
      inputAttributes: {
        input: 'text',
        required: 'true'
      },
      confirmButtonColor: '#007bff',
      preConfirm: function () {
        var a = document.getElementById('reason') as HTMLInputElement;
        if (a != null) {
          if (a.value == '') {
            Swal.showValidationMessage("Please give us your reason");
          }
        }
        return new Promise((resolve, reject) => {
          resolve({
            Reason: $('input[placeholder="Reason..."]').val()
          });

          // maybe also reject() on some condition
        });
      }
    }).then((data: any) => {
      // your input data object will be usable from here
      this.declinedReason = data.value.Reason;
      this.carService.declineCar(this.formCarBasic.carId != undefined ? this.formCarBasic.carId : 0, this.declinedReason).subscribe(
        (resposne: any) => {
          this.errorService.showSwalToastMessage('success', "Decline success", 'top-right', 2000);
          this.route.navigate(['/car-manage']);
        },
        (error: HttpErrorResponse) => {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      );

    });

  }

  insuranceStatus: boolean = false;

  approveInsurance() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Please confirm this car insurance status. It is valid or not',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, it is valid',
      cancelButtonText: 'No, it is not valid',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.insuranceStatus = true;
      }

      this.carService.approveCar(this.formCarBasic.carId != undefined ? this.formCarBasic.carId : 0, this.insuranceStatus).subscribe(
        (resposne: any) => {

          this.errorService.showSwalToastMessage('success', "Approve success", 'top-right', 2000);
          this.route.navigate(['/car-manage']);
        },
        (error: HttpErrorResponse) => {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      );

    });
  }

  approveCar() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to approve for this car. This will make this car available for booking process',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveInsurance();

      }
    });
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
        var a = document.getElementById("editMode") as HTMLInputElement;
        if (a != null) {
          a.checked = true;
        }
        this.isEditing = true;
      }
    });
  }


  ngOnInit(): void {
    if (this.mode == 'edit' || this.mode == 'view') {
      this.getCar();
    }
    else {
      this.isLoading = false;
    }
    this.getRole();
  }

  constructor(private userService: UserService, private carService: CarService, private errorService: ErrorsService, private authService: AuthService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.url = this.route.url;
  }

  public url: string;

  public role: string;

  logout() {
    this.authService.logout(true);
  }

  getRole() {
    this.userService.getUserInfoX().subscribe(
      (response: any) => {
        this.role = response.role;
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

  public steps: string[] = ['Basic', 'Detail', 'Pricing', 'Calendar'];
  public viewSteps: string[] = ['Basic', 'Detail', 'Pricing', 'Calendar', 'Approval'];
  public activeStep = 0;
  public ownerAvatar: string;
  public ownerEmail: string;
  public ownerTel: string;
  public ownerName: string;

  @Input() public formCarBasic: FormCarBasic;
  @Input() public formCarDetail: FormCarDetail;
  @Input() public formCarPricing: FormCarPricing;
  @Input() public formCarCalendar: FormCarCalendar;
  @Input() id: number;
  @Input() mode: string;

  public isApproved: boolean = false;
  nextStep(step: string) {

    if (step == '4') {
      // console.log(this.formCarBasic);
      // console.log(this.formCarDetail);
      // console.log(this.formCarPricing);
      // console.log(this.formCarCalendar);
      if (this.role == 'USER') {
        if (this.mode == 'edit')
          this.carService.addCar(this.formCarBasic, this.formCarDetail, this.formCarPricing, this.formCarCalendar, "Save car successfully !!!");
        else
          this.carService.addCar(this.formCarBasic, this.formCarDetail, this.formCarPricing, this.formCarCalendar, "Add car successfully !!!");
      }
      else {
        this.activeStep = 4;
        this.isApproved = true;
      }
    } else {
      if (this.role == 'ADMIN')
        this.isApproved = false;
      this.activeStep = Number(step);
    }
  }

  receiveFormCarBasic(form: FormCarBasic) {
    this.formCarBasic = form;
  }

  receiveFormCarDetail(form: FormCarDetail) {
    this.formCarDetail = form;
  }
  @ViewChild(FormCarCalendarComponent) calendarComponent: FormCarCalendarComponent;

  receiveFormCarPricing(form: FormCarPricing) {
    this.formCarPricing = form;
    if (this.formCarCalendar != null && this.formCarCalendar != undefined) {
      this.calendarComponent.formCarCalendar = this.formCarCalendar;
      this.calendarComponent.startRentalPeriod = this.formCarCalendar.startRent;
      this.calendarComponent.endRentalPeriod = this.formCarCalendar.endRent;
      this.calendarComponent.start = this.calendarComponent.getDateNowFormatted(this.formCarCalendar.startRent);
      this.calendarComponent.listDate = this.formCarCalendar.listDisplay;
      this.calendarComponent.listSavedDate = this.formCarCalendar.carBusys;
      this.calendarComponent.end = this.calendarComponent.getDateNowFormatted(this.formCarCalendar.endRent);
      this.calendarComponent.selectedTimeStart = this.formCarCalendar.startRent.split('T')[1].split(':')[0] + ":" + this.formCarCalendar.startRent.split('T')[1].split(':')[1];
      this.calendarComponent.selectedTimeEnd = this.formCarCalendar.endRent.split('T')[1].split(':')[0] + ":" + this.formCarCalendar.endRent.split('T')[1].split(':')[1];
      this.calendarComponent.allBusys = this.formCarCalendar.allBusys != undefined ? this.formCarCalendar.allBusys : [];
    }
  }

  formatDate(date: Date): string {
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "/"
      + date.getUTCFullYear();
  }

  receiveFormCarCalendar(form: FormCarCalendar) {
    this.formCarCalendar = form;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
  }
}
