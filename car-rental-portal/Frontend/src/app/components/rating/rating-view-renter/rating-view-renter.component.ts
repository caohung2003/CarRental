import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {BookingResponseBasic} from "../../../models/interfaces/booking.response";
import {Rating} from "../../../models/interfaces/rating";
import {RatingService} from "../../../services/rating.service";
import {ErrorsService} from "../../../services/errors.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {RatingSend} from "../../../models/interfaces/rating-send";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/entities/user.model";

@Component({
  selector: 'app-rating-view-renter',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    PaginatorModule
  ],
  templateUrl: './rating-view-renter.component.html',
  styleUrl: './rating-view-renter.component.css'
})
export class RatingViewRenterComponent {
  public star: number;
  public comment: string;
  @Input() public index: string;
  @Input() public bookingId: number;
  @Input() public userId: number;
  @Input() public booking: BookingResponseBasic;
  @Input() public pick: string | undefined;
  @Input() public drop: string | undefined;
  @Input() public name: string | undefined;
  @Input() public image: string | undefined;
  @Input() public rating: number | undefined;
  @Input() public rides: number | undefined;
  @Input() public price: string | undefined;
  @Input() public duration: number | undefined;
  @Input() public pickFormatDate: string | undefined;
  public ratings: Rating[] = [];
  public stars: number[] = [];
  public mode: string = "view";
  public renterRating: Rating;
  @Input() public user: User | undefined;
  constructor(private ratingService: RatingService,
              private errorService: ErrorsService,
              private authService: AuthService,
              private userService: UserService,
              private route: Router) {
  }

  createArray(n: number): number[] {
    var arr: number[] = [];
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
    return arr;
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
            senderAvatar: response[i].senderAvatar,
            receiverId: response[i].receiverId,
            receiverFirstName: response[i].receiverFirstName,
            receiverLastName: response[i].receiverLastName,
            receiverAvatar: response[i].receiverAvatar,
            dateTime: response[i].dateTime,
            isRenterFeedback: response[i].isRenterFeedback,
            canFixed: response[i].canFixed
          }
          if(!rating.isRenterFeedback) {
            this.star = rating.stars;
            this.renterRating = rating;
            this.comment = rating.comment;
          }
          this.ratings.push(rating);
        }

      }
    )
  }

  convertDateTime(date: string):string {
    if(date != undefined) {
      var dte = new Date(date);
      return (dte.getDate() < 10 ? "0" + dte.getDate() : dte.getDate()) + "/" +
        (dte.getMonth() + 1 < 10 ? "0" + (dte.getMonth() + 1) : dte.getMonth() + 1) + "/" +
        dte.getFullYear();
    }
    else {
      return "";
    }
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
      isRenterFeedback: false,
      isFixed: true
    }
    this.ratingService.sendRate(feedback).subscribe(
      (response: any) => {
        this.booking.isRating = true;
        this.renterRating.canFixed = false;
        this.renterRating.dateTime = new Date().toString();
        this.renterRating.stars = feedback.stars;
        this.renterRating.comment = feedback.comment;
        this.errorService.showSwalToastMessage('success', 'Feedback success', 'top-right', 2000);
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if(error.status == 403) {
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
  checkDateExpired(pickUpDateTime: string | undefined):boolean {
    if(pickUpDateTime != undefined) {
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
    if(mde == 'open') {
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
      if(c != null)
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
}
