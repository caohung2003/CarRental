import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BookingResponseBasic } from "../../../models/interfaces/booking.response";
import { NgForOf, NgIf } from "@angular/common";
import { RatingUserComponent } from "../../rating/rating-user/rating-user.component";
import { RatingViewRenterComponent } from "../../rating/rating-view-renter/rating-view-renter.component";
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective
} from "@coreui/angular";
import { FormsModule } from "@angular/forms";
import { PaginatorModule } from "primeng/paginator";
import { RatingService } from "../../../services/rating.service";
import { ErrorsService } from "../../../services/errors.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { RatingSend } from "../../../models/interfaces/rating-send";
import { HttpErrorResponse } from "@angular/common/http";
import { Rating } from "../../../models/interfaces/rating";
import { BookingService } from "../../../services/booking.service";
import Swal from "sweetalert2";

export interface CarInfo {
  id: number,
  front: string,
  name: string,
  rating: number,
  rides: number,
}

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [NgIf, RatingUserComponent, RatingViewRenterComponent, ModalComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent, FormsModule, PaginatorModule, ButtonDirective, NgForOf, ModalToggleDirective, ButtonCloseDirective],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.css'
})
export class BookingItemComponent implements OnInit, OnChanges {
  redirectToProfile(userId: number | undefined) {
    this.route.navigate(['/profile/' + userId]);
  }
  redirectToMyBooking(bookingId: number) {
    this.route.navigate(['/my-bookings/', bookingId]);
  }
  @ViewChild('option') option!: ElementRef;
  @Input() public booking: BookingResponseBasic;
  @Input() public item: string;
  @Input() public carId: string[] = [];
  @Input() public overlapBookings: number[] = [];
  public ratings: Rating[];
  public renterRating: Rating;

  showOption() {
    var a = document.getElementById("action" + this.item);
    if (a != null) {
      if (a.classList.contains("tw-hidden")) {
        a.classList.remove("tw-hidden");
        a.style.transform = 'none';
      } else {
        a.classList.add("tw-hidden");
        a.style.transform = 'translate3d(1235.2px, 225.6px, 0px)';
      }
    }
  }

  public getRating() {
    this.ratings = [];
    this.ratingService.getAllRatingsByBooking(this.booking.id).subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          var rating: Rating = {
            id: response[i].id,
            stars: response[i].stars,
            comment: response[i].comment,
            senderId: response[i].senderId,
            senderFirstName: response[i].senderFirstName,
            senderLastName: response[i].senderLastName,
            senderAvatar: response[i].senderAvatar == null || response[i].senderAvatar == undefined ? ('assets/images/avatar/avatar1.png') : response[i].senderAvatar,
            receiverId: response[i].receiverId,
            receiverFirstName: response[i].receiverFirstName,
            receiverLastName: response[i].receiverLastName,
            receiverAvatar: response[i].receiverAvatar == null || response[i].receiverAvatar == undefined ? ('assets/images/avatar/avatar1.png') : response[i].receiverAvatar,
            dateTime: response[i].dateTime,
            isRenterFeedback: response[i].isRenterFeedback,
            canFixed: response[i].canFixed
          }
          if (!response[i].isRenterFeedback) {
            this.renterRating = {
              id: response[i].id,
              stars: response[i].stars,
              comment: response[i].comment,
              senderId: response[i].senderId,
              senderFirstName: response[i].senderFirstName,
              senderLastName: response[i].senderLastName,
              senderAvatar: response[i].senderAvatar,
              receiverId: response[i].receiverId,
              receiverFirstName: response[i].receiverFirstName,
              receiverLastName: response[i].receiverLastName,
              receiverAvatar: response[i].receiverAvatar,
              dateTime: response[i].dateTime,
              isRenterFeedback: response[i].isRenterFeedback,
              canFixed: response[i].canFixed
            }
          }
          if (!rating.isRenterFeedback) {
            this.star = rating.stars;
            this.comment = rating.comment;
          }
          this.ratings.push(rating);
        }

      }
    )
  }

  public visibleRate = false;


  createArray(n: number): number[] {
    var arr: number[] = [];
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
    return arr;
  }

  convertDateTime(date: string): string {
    if (date != undefined) {
      var dte = new Date(date);
      return (dte.getDate() < 10 ? "0" + dte.getDate() : dte.getDate()) + "/" +
        (dte.getMonth() + 1 < 10 ? "0" + (dte.getMonth() + 1) : dte.getMonth() + 1) + "/" +
        dte.getFullYear();
    } else {
      return "";
    }
  }

  swalConfirm() {
    Swal.fire({
      title: 'Confirmation',
      text: "For each booking, you only have one time to edit your feedback. Do you wish to continue ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.switchMode('open');
        this.toggleRate()
      }
    })
  }

  toggleRate() {
    if (this.booking.isRating) {
      this.getRating();
    }
    this.visibleRate = !this.visibleRate;
  }

  handleRateChange(event: any) {
    this.visibleRate = event;
  }

  public visibleConfirmModal: boolean = false;

  handleVisibleConfirmModal(event: any) {
    this.visibleConfirmModal = event;
  }

  toggleVisibleConfirmModal() {
    // this.visibleRate = false;
    this.visibleConfirmModal = !this.visibleConfirmModal;
  }

  getDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day.length < 2 ? "0" + day : day}/${month.length < 2 ? "0" + month : month}/${year}`;
  }

  convertMoney(number: number): string {
    // Chuyển số thành chuỗi và ngược lại để dễ xử lý
    let numString: string = String(number);

    // Mảng để lưu trữ các phần tử sau khi được chia nhỏ
    const parts: string[] = [];

    // Tách chuỗi thành các phần từ có độ dài là 3
    while (numString.length > 3) {
      parts.unshift(numString.slice(-3)); // Thêm phần tử vào đầu mảng
      numString = numString.slice(0, -3); // Loại bỏ 3 ký tự cuối
    }

    // Thêm phần tử cuối cùng vào mảng
    parts.unshift(numString);

    // Kết hợp các phần tử bằng dấu chấm
    return parts.join(',');
  }

  expand(event: MouseEvent) {
    const svgElement = (event.target as HTMLElement).closest('svg');
    if (svgElement) {
      if (svgElement.classList.contains('tw-rotate-180')) {
        svgElement.classList.remove('tw-rotate-180');
      } else {
        svgElement.classList.add('tw-rotate-180');
      }
    }
  }

  checkDateExpired(pickUpDateTime: string): boolean {
    if (new Date(new Date(pickUpDateTime).getTime() + 7 * 86400000).getTime() < new Date().getTime()) {
      return true;
    } else {
      return false;
    }

  }

  public listCarByBooking: CarInfo[] = [];

  getCar(id: any) {
    let one: CarInfo = {
      id: 0,
      front: '',
      name: '',
      rating: 0,
      rides: 0,
    };
    if (this.listCarByBooking.find(car => car.id === id) != undefined && this.listCarByBooking.find(car => car.id === id) != null) return this.listCarByBooking.find(car => car.id === id);
    else return one;
  }


  //feedback
  public star: number = 0;
  public comment: string = "";


  constructor(private ratingService: RatingService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router,
    public dialog: MatDialog,
    private bookingService: BookingService
  ) {
  }

  @Input() clickBooking: number;

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName == 'overlapBookings') {
        let change = changes[propName];
        let curVal = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);
        if (prevVal != undefined) {
          if (prevVal != curVal) {
            var a = document.getElementById("booking" + this.booking.id);
            if (a != null) {
              if (this.overlapBookings.includes(this.booking.id)) {
                a.style.opacity = "40%";
              }
              else {
                a.style.opacity = "100%";
              }
            }
          }
        }
      }
      else if (propName == 'clickBooking') {
        let change = changes[propName];
        let curVal = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);
        if (prevVal != undefined) {
          if (prevVal != curVal) {
            var a = document.getElementById("booking" + this.booking.id);
            if (a != null) {
              if (this.clickBooking == this.booking.id) {
                a.style.border = "2px solid black";
              }
              else {
                a.style.border = "none";
              }
            }
          }
        }
      }

    }
  }

  ngOnInit(): void {
    this.getRating();

    if (this.mode == 'view') {
      var a = document.getElementById("viewR" + this.item);
      if (a != null) {
        a.style.display = 'block';
      }
      var b = document.getElementById("changeR" + this.item);
      if (b != null) {
        b.style.display = 'none'
      }
    }

  }


  sendFeedback(value: any) {
    var feedback: RatingSend = {
      booking: {
        id: this.booking.id
      },
      stars: this.star,
      comment: this.comment,
      dateTime: new Date(),
      isRenterFeedback: false
    }
    this.ratingService.sendRate(feedback).subscribe(
      (response: any) => {
        this.booking.isRating = true;
        this.errorService.showSwalToastMessage('success', 'Feedback success', 'top-right', 2000);
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
    );
    this.visibleRate = false;
    if (this.mode == "edit") {
      var a = document.getElementById("viewR" + this.item);
      if (a != null) {
        a.style.display = 'block';
      }
      var b = document.getElementById("changeR" + this.item);
      if (b != null) {
        b.style.display = 'none'
      }
    }
  }

  fillStar(star: string) {
    switch (star) {
      case 's5':
        this.star = 5;
        break;
      case 's4':
        this.star = 4;
        break;
      case 's3':
        this.star = 3;
        break;
      case 's2':
        this.star = 2;
        break;
      case 's1':
        this.star = 1;
        break;
      case 's51' + this.item:
        this.star = 5;
        break;
      case 's41' + this.item:
        this.star = 4;
        break;
      case 's31' + this.item:
        this.star = 3;
        break;
      case 's21' + this.item:
        this.star = 2;
        break;
      case 's11' + this.item:
        this.star = 1;
        break;
    }
  }

  public mode = "view";

  switchMode(mde: string) {
    this.mode = "edit";
    var a = document.getElementById("viewR" + this.item);
    if (a != null) {
      a.style.display = 'none';
    }
    var b = document.getElementById("changeR" + this.item);
    if (b != null) {
      b.style.display = 'block'
    }
    switch (this.star) {
      case 1: {
        var a = document.getElementById("s11" + this.item);
        a?.click();
        break;
      }
      case 2: {
        var a = document.getElementById("s21" + this.item);
        a?.click();
        break;
      }
      case 3: {
        var a = document.getElementById("s31" + this.item);
        a?.click();
        break;
      }
      case 4: {
        var a = document.getElementById("s41" + this.item);
        a?.click();
        break;
      }
      case 5: {
        var a = document.getElementById("s51" + this.item);
        a?.click();
        break;
      }
    }
  }

  public modalMode = 'rating';

  closeEditMode() {
    var a = document.getElementById("viewR" + this.item);
    if (a != null) {
      a.style.display = 'block';
    }
    var b = document.getElementById("changeR" + this.item);
    if (b != null) {
      b.style.display = 'none'
    }
  }

  toggleConfirm() {
    var bookings = "";
    for (let i = 0; i < this.overlapBookings.length; i++) {
      bookings += this.overlapBookings[i];
      if (i != this.overlapBookings.length - 1) {
        bookings += ", ";
      }
    }
    // this.modalMode = 'confirm_pending';
    // this.visibleConfirmModal = !this.visibleConfirmModal;
    Swal.fire({
      title: 'Confirmation',
      html: 'Are you sure you want to confirm this booking? If you confirm this, booking number <span style="font-weight: bold">' + bookings + '</span> will be cancelled due to conflict time',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm this booking',
      cancelButtonText: 'No, I dont want to',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmBooking('ACCEPTED');
      } else {
      }
    });
  }

  public cancelCountdown: number = 5;
  timer: any;

  toggleDecline() {
    Swal.fire({
      title: 'Cancel',
      text: 'Are you sure you want to cancel this booking? This action cannot be undo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel this booking',
      cancelButtonText: 'No, I dont want to',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmBooking('DECLINED');
      } else {
      }
    });

  }

  stopCountdown() {
    clearInterval(this.timer);
    var a = document.getElementById("decline" + this.item);
    var b = document.getElementById("ct" + this.item);
    if (a != null && b != null) {
      a.ariaDisabled = "false";
      a.classList.remove("disabled");
      b.style.display = "none";
      (document.getElementById("decline" + this.item) as HTMLButtonElement).disabled = false;
    }
  }

  toggleConfirmPickUp() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to confirm pick up? This means that you have received the deposit and agree with renter location and date time',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'No, I dont want to',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmPickUp();
      } else {
      }
    });
    // this.modalMode = 'confirm_pick_up';
    // this.visibleConfirmModal = !this.visibleConfirmModal;
  }

  toggleConfirmReturn() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to confirm return? This means that you have received the car and the remaining payment, this trip will also ended here',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'No, I dont want to',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmReturn();
      } else {
      }
    });
    // this.modalMode = "confirm_return";
    // this.visibleConfirmModal = !this.visibleConfirmModal;
  }

  toggleNotifyWaitForDeposit() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Please wail until renter pay deposit',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Understood',
      cancelButtonText: 'No',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {

      } else {
      }
    });
    // this.modalMode = "wait_for_deposit";
    // this.visibleConfirmModal = !this.visibleConfirmModal;
  }

  confirmPickUp() {
    this.bookingService.confirmPickUp(this.booking.id).subscribe(
      (response: any) => {
        this.booking.status = "IN_PROGRESS";
        this.errorService.showSwalToastMessage('success', 'Confirm pick up success', 'top-right', 2000);
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

  confirmBooking(decision: string) {
    if (decision == 'ACCEPTED') {
      this.bookingService.confirmBooking(this.booking.id, decision).subscribe(
        (response: any) => {
          if (this.booking.paymentType == 'WALLET') {
            this.booking.status = 'PENDING_DEPOSIT';
          } else {
            this.booking.status = 'PENDING_PICK_UP';
          }

          if (this.carId.length > 0) {
            if (this.carId[0] != '0') {
              this.route.navigate(['/car-booking/Inprogress/' + this.carId])
            } else {
              this.route.navigate(['/car-booking/Inprogress']);
            }
          } else {
            this.route.navigate(['/car-booking/Inprogress']);
          }

          this.errorService.showSwalToastMessage('success', 'Confirm booking successfully', 'top-right', 2000);
        },
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authService.logout(true, 'Your login session is expired');
          } else if (error.status == 403) {
            this.route.navigate(['/403']);
          } else {
            this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
          }
        }
      );
    } else {
      this.bookingService.confirmBooking(this.booking.id, decision).subscribe(
        (response: any) => {
          this.booking.status = 'CANCELED';
          if (this.carId.length > 0) {
            if (this.carId[0] != '0') {
              this.route.navigate(['/car-booking/Completed/' + this.carId])
            } else {
              this.route.navigate(['/car-booking/Completed']);
            }
          } else {
            this.route.navigate(['/car-booking/Completed']);
          }
          this.errorService.showSwalToastMessage('success', 'Decline booking successfully', 'top-right', 2000);
        },
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authService.logout(true, 'Your login session is expired');
          } else if (error.status == 403) {
            this.route.navigate(['/403']);
          } else {
            this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
          }
        }
      );
    }
  }

  confirmReturn() {
    this.bookingService.confirmReturn(this.booking.id).subscribe(
      (response: any) => {
        if (response == 'COMPLETED') {
          this.booking.status = 'COMPLETED';

          if (this.carId.length > 0) {
            if (this.carId[0] != '0') {
              this.route.navigate(['/car-booking/Completed/' + this.carId])
            } else {
              this.route.navigate(['/car-booking/Completed']);
            }
          } else {
            this.route.navigate(['/car-booking/Completed']);
          }
        }
        else {
          this.booking.status = 'PENDING_PAYMENT';
        }

        this.errorService.showSwalToastMessage('success', 'Confirm return successfully', 'top-right', 2000);
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Your login session is expired');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    );
  }


}
