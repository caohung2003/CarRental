import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCalendar, MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatFormField } from "@angular/material/form-field";
import { DateRangeComponent } from "../../../shared/components/date-range/date-range.component";
import { FormsModule } from "@angular/forms";
import { MapComponent } from "../../map/map.component";
import { NgForOf, NgIf } from "@angular/common";
import { CarBusyCalendar } from "../../../models/interfaces/car-busy-calendar";
import Swal from "sweetalert2";
import { FormCarCalendar } from "../../../models/interfaces/form-carcalendar";
import { initFlowbite } from "flowbite";
import { DatePickerComponent } from "../../../shared/components/date-picker/date-picker.component";
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { AuthService } from '../../../services/auth.service';
import { ErrorsService } from '../../../services/errors.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-car-calendar',
  standalone: true,
  imports: [
    MatCalendar,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    DateRangeComponent,
    FormsModule,
    MapComponent,
    NgForOf,
    DatePickerComponent,
    RouterLink,
    NgIf
  ],
  templateUrl: './form-car-calendar.component.html',
  styleUrl: './form-car-calendar.component.css'

})
export class FormCarCalendarComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private carService: CarService, private route: Router, private authService: AuthService, private errorService: ErrorsService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName == 'mode') {
        let change = changes[propName];
        let curVal = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);
        if (curVal != prevVal) {
          if (curVal != undefined && curVal !== '') {
            console.log("Cur: " + curVal);
            this.view = curVal.replaceAll('"', '');
          }
        }
      }
    }
  }
  ngAfterViewInit(): void {
    initFlowbite();
  }




  public selectedTimeStart: string = "";
  public selectedTimeEnd: string = "";

  public timeStart: number = 0;
  public timeEnd: number = 0;

  @ViewChild(DateRangeComponent) dateRange: DateRangeComponent;

  public listDate: string[] = [];
  public listSavedDate: CarBusyCalendar[] = [];
  public allBusys: CarBusyCalendar[] = [];

  @Input() public formCarCalendar: FormCarCalendar;
  public startRentalPeriod: string = "";
  public endRentalPeriod: string = "";
  public endTimeRent: string = "3";
  @Output() updateData: EventEmitter<string> = new EventEmitter();
  @Output() sendFormCarCalendar: EventEmitter<FormCarCalendar> = new EventEmitter();
  selectedTimeStartShow: number = 480;
  selectedTimeEndShow: number = 480;
  start: string = "";
  end: string = "";

  convertDateSqlToString(s: string): string {
    var result: string = "";
    var arr: string[] = s.split('T');
    for (var i = 0; i < arr.length; i++) {
      if (i == 0) {
        result += (arr[i].split('-')[2] + '-' + arr[i].split('-')[1] + '-' + arr[i].split('-')[0]);
        result += " ";
      }
      else {
        result += (arr[i].split(':')[0] + ':' + arr[i].split(':')[1]);
      }
    }
    return result;
  }

  ngOnInit(): void {
    //initFlowbite();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.formCarCalendar != null) {

      this.endTimeRent = (this.formCarCalendar.rentTime).toString();
      this.start = this.getDateNowFormatted(this.formCarCalendar.startRent);
      this.end = this.getDateNowFormatted(this.formCarCalendar.endRent);
      this.startRentalPeriod = this.start;
      this.endRentalPeriod = this.end;
    }
    else {
      this.start = this.getDateNowFormatted();
      this.end = this.getDateAfter3DaysFormatted();
      this.startRentalPeriod = this.convertDate3(this.start);
      this.endRentalPeriod = this.convertDate3(this.end);
    }

    this.initializeTimeOptions();
    // this.selectedTimeStartShow = this.convertTimeToMinutes(this.selectedTimeStart);
    // this.selectedTimeEndShow = this.convertTimeToMinutes(this.selectedTimeEnd);
  }

  convertDate3(date: string): string {
    var s = date.split('/');
    return s[1] + '-' + s[0] + '-' + s[2];
  }

  convertDate(date: string): string {
    var s = date.split('/');
    return s[2] + '-' + s[1] + '-' + s[0];
  }

  convertDate2(date: string): string {
    var s = date.split('-');
    return s[2] + '-' + s[1] + '-' + s[0];
  }

  getSavedDate(s: string[], index: number): string {
    var display: string = "";
    var dte: string[] = s[index].split('T');
    for (let j = 0; j < dte.length; j++) {
      if (j == 0) {
        display += (this.convertDate(dte[j]));
      } else {
        var minute = Number(dte[j]);
        display += "T";
        if (minute == 0) {
          display += "00:00";
        } else {
          display += (Math.floor(minute / 60) < 10 ? ("0" + Math.floor(minute / 60)) : (Math.floor(minute / 60)));
          display += ":";
          if (minute % 60 == 0) {
            display += "00";
          } else {
            display += "30";
          }
        }
      }

    }
    return display;
  }

  getDisplayString(s: string[], index: number): string {
    var display: string = "";
    var dte: string[] = s[index].split('T');
    for (let j = 0; j < dte.length; j++) {
      if (j == 0) {
        display += (dte[j] + " ");
      } else {
        var minute = Number(dte[j]);
        if (minute == 0) {
          display += "00:00";
        } else {
          display += (Math.floor(minute / 60) < 10 ? ("0" + Math.floor(minute / 60)) : (Math.floor(minute / 60)));
          display += ":";
          if (minute % 60 == 0) {
            display += "00";
          } else {
            display += "30";
          }
        }
      }

    }
    return display;
  }

  receiveRentalPeriod(date: string) {
    var display: string = "";
    var start: string = "";
    var end: string = "";
    var s: string[] = date.split(' to ');
    for (let i = 0; i < s.length; i++) {
      if (i == 0) {
        display += this.getDisplayString(s, 0);
        display += " to ";
        start = this.getSavedDate(s, 0);
      } else {
        display += this.getDisplayString(s, 1);
        end = this.getSavedDate(s, 1);
      }
    }
    this.startRentalPeriod = start;
    this.endRentalPeriod = end;
  }

  receiveDate1(date: string) {
    var display: string = "";
    var start: string = "";
    var end: string = "";
    var s: string[] = date.split(' to ');
    for (let i = 0; i < s.length; i++) {
      if (i == 0) {
        display += this.getDisplayString(s, 0);
        display += " to ";
        start = this.getSavedDate(s, 0);
      } else {
        display += this.getDisplayString(s, 1);
        end = this.getSavedDate(s, 1);
      }
    }
    this.startRentalPeriod = start;
    this.endRentalPeriod = end;
    this.checkTimeBusyWhenChangePeriod();
    // console.log(this.startRentalPeriod + ' ' + this.endRentalPeriod);
  }


  receiveDate(date: string) {
    var display: string = "";
    var start: string = "";
    var end: string = "";
    var s: string[] = date.split(' to ');
    for (let i = 0; i < s.length; i++) {
      if (i == 0) {
        display += this.getDisplayString(s, 0);
        display += " to ";
        start = this.getSavedDate(s, 0);
      } else {
        display += this.getDisplayString(s, 1);
        end = this.getSavedDate(s, 1);
      }
    }
    var carBusyCalendar: CarBusyCalendar = {
      start: start,
      end: end
    }
    if (new Date(start).getTime() > new Date(new Date(end).setHours(new Date(end).getHours() - 2)).getTime()) {
      this.showToastNoti("Start time must smaller than end time");
    } else {
      if (!this.checkInRentPediod(start, end)) {
        var check = this.checkTimerange(start, end);
        if (!check) {
          this.checkOverlappDate(start, end);
          this.listSavedDate.push(carBusyCalendar);
          this.listDate.push(display);
        }
      }
    }
  }

  convertDateToFormatString(date: string): string {
    var display: string = "";
    var dte: string[] = date.split('T');
    for (let j = 0; j < dte.length; j++) {
      if (j == 0) {
        display += (this.convertDate2(dte[j]));
      } else {
        display += (" " + dte[j]);

      }

    }
    return display;
  }

  checkTimerange(start: string, end: string): boolean {
    for (let i = 0; i < this.listSavedDate.length; i++) {
      var endDate = this.listSavedDate[i].end;
      var startDate = this.listSavedDate[i].start;
      if (new Date(start).getTime() == new Date(endDate).getTime()) {
        this.listSavedDate[i].end = end;
        this.listSavedDate[i].start = startDate;
        this.listDate[i] = this.convertDateToFormatString(this.listSavedDate[i].start) + ' to ' + this.convertDateToFormatString(this.listSavedDate[i].end);
        return true;
      } else if (new Date(end).getTime() == new Date(startDate).getTime()) {
        this.listSavedDate[i].start = start;
        this.listDate[i] = this.convertDateToFormatString(this.listSavedDate[i].start) + ' to ' + this.convertDateToFormatString(this.listSavedDate[i].end);
        return true;
      }
    }
    return false;
  }


  showToastNoti(message: string) {
    Swal.fire({
      title: 'Confirmation',
      html: message,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Close',
      confirmButtonColor: '#007bff',
    }).then((result) => {
    });
  }

  checkInRentPediod(start: string, end: string) {
    if (new Date(start).getTime() < new Date(this.startRentalPeriod).getTime() || new Date(end).getTime() > new Date(this.endRentalPeriod).getTime()) {
      this.showToastNoti("Please pick a time busy that in rental period");
      return true;
    }
    return false;
  }

  checkOverlappDate(start: string, end: string) {
    for (let i = 0; i < this.listSavedDate.length; i++) {
      if ((new Date(start).getTime() <= new Date(this.listSavedDate[i].start).getTime() && new Date(this.listSavedDate[i].start).getTime() <= new Date(end).getTime()) ||
        (new Date(this.listSavedDate[i].start).getTime() <= new Date(start).getTime() && new Date(start).getTime() <= new Date(this.listSavedDate[i].end).getTime())) {
        this.listSavedDate.splice(i, i + 1);
        this.listDate.splice(i, i + 1);
        i--;
      }

    }
  }

  @Input() public carId: number;

  removeEleDate(i: number) {
    this.listSavedDate.splice(i, i + 1);
    this.listDate.splice(i, i + 1);
  }

  @Input() public role: string;
  @Input() public isApproval: boolean;

  formatStringToDate(date: Date) {
    console.log(date);
    return date.getUTCFullYear() + "-"
      + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "-"
      + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
      + "T"
      + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
      + ":"
      + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  }

  nextPage() {
    if (this.checkValidDate((this.startRentalPeriod), (this.endRentalPeriod))) {

      this.formCarCalendar = {
        startRent: this.formatStringToDate(new Date(new Date((this.startRentalPeriod)).setMonth(new Date((this.startRentalPeriod)).getMonth() + 1))),
        endRent: this.formatStringToDate(new Date(new Date((this.endRentalPeriod)).setMonth(new Date((this.endRentalPeriod)).getMonth() + 1))),
        carBusys: this.listSavedDate,
        listDisplay: this.listDate,
        rentTime: Number(this.endTimeRent)
      }
      //console.log(this.formCarCalendar);
      this.sendFormCarCalendar.emit(this.formCarCalendar);
      this.updateData.emit("4");
    }

  }


  getDateNowFormatted(dte?: string): string {
    var date: Date;

    if (dte != null) {
      date = new Date(dte);
    }
    else {
      date = new Date();

    }
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getUTCFullYear();
    //  return date;
  }

  getDateAfter3DaysFormatted(dte?: string): string {
    var date: Date;
    if (dte != null) {
      date = new Date(dte);
    }
    else {
      date = new Date();

    }
    date.setDate(date.getDate() + 3);
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getUTCFullYear();
    // return date;
  }

  @ViewChild("startHtml", { static: false }) public startEle: ElementRef;
  @ViewChild("endHtml", { static: false }) public endEle: ElementRef;



  previousPage() {

    if (this.checkValidDate((this.startRentalPeriod), (this.endRentalPeriod))) {
      this.formCarCalendar = {
        startRent: this.formatStringToDate(new Date(new Date((this.startRentalPeriod)).setMonth(new Date((this.startRentalPeriod)).getMonth() + 1))),
        endRent: this.formatStringToDate(new Date(new Date((this.endRentalPeriod)).setMonth(new Date((this.endRentalPeriod)).getMonth() + 1))),
        carBusys: this.listSavedDate,
        listDisplay: this.listDate,
        rentTime: Number(this.endTimeRent)
      }
      this.sendFormCarCalendar.emit(this.formCarCalendar);
      this.updateData.emit("2");
    }
  }

  checkTimeBusyWhenChangePeriod() {

    for (let i = 0; i < this.listSavedDate.length; i++) {
      if (new Date((this.endRentalPeriod)).getTime() < new Date(this.listSavedDate[i].end).getTime() || new Date((this.startRentalPeriod)).getTime() > new Date(this.listSavedDate[i].start).getTime()) {
        this.listSavedDate.splice(i, i + 1);
        this.listDate.splice(i, i + 1);
        i--;
      }

    }
  }

  convertTimeToMinutes(timeString: string): number {
    if (timeString && timeString !== '') {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
    return 0;
  }

  private _myElementValue: any;

  timeOptions: {
    value: number;
    label: string
  }[] = [];

  initializeTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const value = hour * 60 + minute; // Calculate total minutes
        const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`; // Format label
        this.timeOptions.push({ value, label });
      }
    }
  }


  getDate(datetime
    :
    string
  ):
    string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${day.length < 2 ? "0" + day : day}`;
  }

  getMonth(datetime
    :
    string
  ):
    string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${month.length < 2 ? "0" + month : month}`;
  }

  getYear(datetime
    :
    string
  ):
    string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${year}`;
  }

  getTime(datetime
    :
    string
  ):
    string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`;
  }

  roundStars(stars
    :
    number
  ):
    number {
    return Math.round(stars);
  }

  compareDates(dateTimeString1
    :
    string, dateTimeString2
      :
      string
  ):
    number {
    // Parse date-time strings into Date objects
    const dateTime1 = new Date(dateTimeString1);
    const dateTime2 = new Date(dateTimeString2);

    // Convert both date times to milliseconds since Unix epoch
    const time1 = dateTime1.getTime();
    const time2 = dateTime2.getTime();

    // Compare the milliseconds values
    if (time1 < time2) {
      return -1;
    } else if (time1 > time2) {
      return 1;
    } else {
      return 0; // Dates are equal
    }
  }

  format(s: string) {
    return s.split('/')[2] + "-" + s.split('/')[1] + "-" + s.split('/')[0];
  }

  convertDateFormat(dateTimeString
    :
    string
  ):
    string {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day}/${month}/${year}`;
  }

  countDays(startDate
    :
    string, endDate
      :
      string
  ):
    string {
    if (startDate == null || endDate == null || "" == endDate || "" == startDate) return "…";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end.getTime() < start.getTime()) return "…";
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}`;
  }


  getDateFormatted(date
    :
    string
  ) {
    var s = date.split('-');
    return s[2] + '/' + s[1] + '/' + s[0];
  }


  checkValidDate(start: string, end: string) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    if (this.view == 'add') {
      if (startDate.getTime() < new Date().getTime()) {
        this.showToastNoti("Start period must be today or after that");
        return false;
      } else if (startDate.getTime() - new Date().getTime() > 13140000000 || endDate.getTime() - startDate.getTime() > 13140000000) {
        this.showToastNoti("Maximum period is 5 months from now");
        return false;
      }
    }
    else {
      if (startDate.getTime() < new Date(this.formCarCalendar.startRent).getTime()) {
        if (startDate.getTime() < new Date().getTime()) {
          this.showToastNoti("Start period must be today or after that");
          return false;
        }
      } else if (startDate.getTime() - new Date().getTime() > 13140000000 || endDate.getTime() - startDate.getTime() > 13140000000) {
        this.showToastNoti("Maximum period is 5 months from now");
        return false;
      }
    }
    return true;
  }



  oldStart: number = new Date(this.startRentalPeriod).getTime();
  oldEnd: number = new Date(this.endRentalPeriod).getTime();
  oldStartStr: string = this.start;
  oldEndStr: string = this.end;

  @Input() view: string;

  checkValid() {

    if (this.view == 'add') {
      var a = this.startEle.nativeElement.value + "T" + this.selectedTimeStartShow + ' to ' + this.endEle.nativeElement.value + "T" + this.selectedTimeEndShow;
      this.receiveRentalPeriod(a);
      var startDate = new Date(this.startRentalPeriod);
      var endDate = new Date(this.endRentalPeriod);

      if (this.oldStart != startDate.getTime() || this.oldEnd != endDate.getTime()) {
        if (startDate.getTime() < new Date().getTime()) {
          this.showToastNoti("Start period must be today or after that");
          this.startEle.nativeElement.value = this.oldStartStr;
        } else if (startDate.getTime() - new Date().getTime() > 13140000000 || endDate.getTime() - startDate.getTime() > 13140000000) {
          this.showToastNoti("Maximum period is 5 months from now");
          this.startEle.nativeElement.value = this.oldStartStr;
          this.endEle.nativeElement.value = this.oldEndStr;
        }
        for (let i = 0; i < this.listSavedDate.length; i++) {
          if (new Date(this.endRentalPeriod).getTime() < new Date(this.listSavedDate[i].end).getTime() || new Date(this.startRentalPeriod).getTime() > new Date(this.listSavedDate[i].start).getTime()) {
            this.listSavedDate.splice(i, i + 1);
            this.listDate.splice(i, i + 1);
            i--;
          }
        }

      }
      this.oldStart = startDate.getTime();
      this.oldEnd = endDate.getTime()
      this.oldStartStr = this.startEle.nativeElement.value;
      this.oldEndStr = this.endEle.nativeElement.value;
    }


  }


  declinedReason: string = '';
  decline() {
    Swal.fire({
      title: 'Confirmation',
      html: `Are you sure you want to decline this car ? Please give us your reasons <br/><textarea id = "reason" style = "margin-top: 20px; width: 90%; border-radius: 10px" class="input" type="text" required placeholder="Reason..."></textarea>`,
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
            Reason: $('textarea[placeholder="Reason..."]').val()
          });

          // maybe also reject() on some condition
        });
      }
    }).then((data: any) => {
      // your input data object will be usable from here
      this.declinedReason = data.value.Reason;
      this.carService.declineCar(this.carId, this.declinedReason).subscribe(
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

      this.carService.approveCar(this.carId, this.insuranceStatus).subscribe(
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
}
