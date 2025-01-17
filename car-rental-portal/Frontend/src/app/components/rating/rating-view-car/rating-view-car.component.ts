import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgForOf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PaginatorModule } from "primeng/paginator";
import { BookingResponseBasic } from "../../../models/interfaces/booking.response";
import { RatingService } from "../../../services/rating.service";
import { Rating } from "../../../models/interfaces/rating";
import { RatingSend } from "../../../models/interfaces/rating-send";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorsService } from "../../../services/errors.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rating-view-car',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    PaginatorModule,
    CommonModule,
    ModalComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent, ButtonDirective, ModalToggleDirective, ButtonCloseDirective
  ],
  templateUrl: './rating-view-car.component.html',
  styleUrl: './rating-view-car.component.css'
})
export class RatingViewCarComponent implements OnInit {
  public star: number;
  public comment: string;
  @Input() public index: number;
  @Input() public bookingId: number;
  @Input() public image: string | undefined;
  @Input() public name: string | undefined;
  @Input() public rating: number | undefined;
  @Input() public rides: number | undefined;
  @Input() public price: string | undefined;
  @Input() public pick: string | undefined;
  @Input() public drop: string | undefined;
  @Input() public duration: number;
  @Input() public pickFormatDate: string | undefined;
  @Input() public booking: BookingResponseBasic;
  public ratings: Rating[] = [];
  public stars: number[] = [];
  public mode: string = "view";
  public renterRating: Rating;
  constructor(private ratingService: RatingService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router) {
  }
  createArray(n: number): number[] {
    var arr: number[] = [];
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
    return arr;
  }

  visibleRate: boolean = false;

  toggleRate() {
    this.visibleRate = !this.visibleRate;
  }

  handleRateChange(event: any) {
    this.visibleRate = event;
  }

  

  ngOnInit(): void {
    this.ratingService.getAllRatingsByBooking(this.bookingId).subscribe(
      (response: any) => {
        console.log(response);
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
          if (rating.isRenterFeedback) {
            this.star = rating.stars;
            this.renterRating = rating;
            this.comment = rating.comment;
          }
          this.ratings.push(rating);
        }

      }
    )
  }

  convertDateTime(date: string): string {
    if (date != undefined) {
      var dte = new Date(date);
      return (dte.getDate() < 10 ? "0" + dte.getDate() : dte.getDate()) + "/" +
        (dte.getMonth() + 1 < 10 ? "0" + (dte.getMonth() + 1) : dte.getMonth() + 1) + "/" +
        dte.getFullYear();
    }
    else {
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
        this.toggleRate();
       // this.toggleRate()
      }
    })
  }

  sendFeedback(value: any) {
    // console.log(this.star + " " + this.comment);
    var feedback: RatingSend = {
      id: this.renterRating.id,
      booking: {
        id: this.bookingId
      },
      stars: this.star,
      comment: this.comment,
      dateTime: new Date(),
      isRenterFeedback: true,
      isFixed: true
    }
    this.ratingService.sendRate(feedback).subscribe(
      (response: any) => {
        this.booking.isRating = true;
        this.renterRating.canFixed = false;
        this.renterRating.dateTime = new Date().toString();
        this.renterRating.stars = feedback.stars;
        this.renterRating.comment = feedback.comment;
        this.errorService.showSwalToastMessage('success', 'Feedback successful', 'top-right', 2000);
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
    }
    //console.log(this.star);
  }
  checkDateExpired(pickUpDateTime: string | undefined): boolean {
    if (pickUpDateTime != undefined) {
      if (new Date(new Date(pickUpDateTime).getTime() + (7) * 86400000).getTime() < new Date().getTime()) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }

  }
  switchMode(mde: string) {
    if (mde == 'open') {
      this.mode = 'edit';
      if (this.mode == 'edit') {
        var a = document.getElementById("viewForm" + this.index);
        var b = document.getElementById("editForm" + this.index);
        if (a != null && b != null) {
          a.style.display = 'none';
          b.style.display = 'block';
        }
      }
      switch (this.star) {
        case 1: {
          document.getElementById("st1" + this.index)?.click();
          break;
        }
        case 2: {
          document.getElementById("st2" + this.index)?.click();
          break;
        }
        case 3: {
          document.getElementById("st3" + this.index)?.click();
          break;
        }
        case 4: {
          document.getElementById("st4" + this.index)?.click();
          break;
        }
        case 5: {
          console.log("st5" + this.index);
          console.log(document.getElementById("st5" + this.index));
          document.getElementById("st5" + this.index)?.click();
          break;
        }
      }
    }
    else {

      var c = document.getElementById("close" + this.index);
      if (c != null)
        c.click()
      this.mode = 'view';
      var a = document.getElementById("viewForm" + this.index);
      var b = document.getElementById("editForm" + this.index);
      if (a != null && b != null) {
        a.style.display = 'block';
        b.style.display = 'none';
      }
    }
  }

  redirect(link: string) {
    // this.route.navigate([link]);
    window.open(link, '_blank');
  }
}
