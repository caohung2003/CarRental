import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { PaginatorModule } from "primeng/paginator";
import { RatingService } from "../../../services/rating.service";
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
import { HttpErrorResponse } from "@angular/common/http";
import { RatingSend } from "../../../models/interfaces/rating-send";
import { BookingResponseBasic } from "../../../models/interfaces/booking.response";
import { NgForOf, NgIf } from '@angular/common';
import { Rating } from '../../../models/interfaces/rating';

@Component({
  selector: 'app-rating-car',
  standalone: true,
  imports: [FormsModule, PaginatorModule, ModalComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent, ButtonDirective, ModalToggleDirective, ButtonCloseDirective, NgForOf, NgIf],
  templateUrl: './rating-car.component.html',
  styleUrl: './rating-car.component.css'
})
export class RatingCarComponent implements OnInit {
  public star: number = 0;
  public comment: string = "";

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

  constructor(private ratingService: RatingService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router
  ) {
  }
  ngOnInit(): void {
    this.getRating();
  }

  public ratings: Rating[] = [];

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
    }
    else {
      return "";
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
  
       
          this.ratings.push(rating);
        }

      }
    )
  }

  sendFeedback(value: any) {
    // console.log(this.star + " " + this.comment);
    var feedback: RatingSend = {
      booking: {
        id: this.bookingId
      },
      stars: this.star,
      comment: this.comment,
      dateTime: new Date(),
      isRenterFeedback: true
    }
    this.ratingService.sendRate(feedback).subscribe(
      (response: any) => {
        this.booking.isRating = true;
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

  visibleRate: boolean = false;

  toggleRate() {
    this.visibleRate = !this.visibleRate;
  }

  handleRateChange(event: any) {
    this.visibleRate = event;
  }

  redirect(link: string) {
    // this.route.navigate([link]);
    window.open(link, '_blank');
  }

}
