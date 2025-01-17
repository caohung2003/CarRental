import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../../models/interfaces/rating';
import { RatingService } from '../../../services/rating.service';
import { RatingSend } from '../../../models/interfaces/rating-send';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ErrorsService } from '../../../services/errors.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-feedback-item',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, RouterLink],
  templateUrl: './feedback-item.component.html',
  styleUrl: './feedback-item.component.css'
})
export class FeedbackItemComponent implements OnInit {
  toggleBookingDetail(id: number | undefined) {
    if(id != undefined)
      this.route.navigate(['/my-bookings/' + id]);
  }

  public star: number;
  public comment: string;
  changeStars(id: string) {
    this.star = Number(id) + 1;
    for (let i = 0; i < this.arr.length; i++) {
      var a = document.getElementById("star" + i + this.i);
      if (a != null) {
        if (i > Number(id)) {
          a.style.fill = "gray";
        }
        else {
          a.style.fill = "rgb(255, 198, 52)";
        }
      }

    }
  }

  constructor(private ratingService: RatingService, private authService: AuthService, private errorService: ErrorsService, private route: Router) {

  }
  ngOnInit(): void {
    this.star = this.rating.stars;
    this.comment = this.rating.comment;
  }

  sendFeedback() {
    if (this.rating.bookingId != undefined) {
      var feedback: RatingSend = {
        id: this.rating.id,
        booking: {
          id: this.rating.bookingId
        },
        stars: this.star,
        comment: this.comment,
        dateTime: new Date(),
        isRenterFeedback: this.rating.isRenterFeedback
      }
      this.ratingService.sendRate(feedback).subscribe(
        (response: any) => {
          this.rating.stars = this.star;
          this.rating.canFixed = false;
          this.rating.comment = this.comment;
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

    var eleTa = document.getElementById('textarea' + this.i.toString());
    var eleP = document.getElementById('p' + this.i.toString());
    var btnTa = document.getElementById('btnEdit' + this.i.toString());
    var btnP = document.getElementById('btnCancel' + this.i.toString());
    if (eleTa != null && eleP != null && btnTa != null && btnP != null) {
      if (eleP.classList.contains('tw-hidden')) {
        eleTa.classList.add("tw-hidden");
        eleP.classList.remove("tw-hidden");
        btnP.classList.add("tw-hidden");
        btnTa.textContent = 'Edit';
        this.isEditing = false;
      }
    }
  }

  public isEditing: boolean = false;
  editMode(index: number): void {
    var eleTa = document.getElementById('textarea' + index.toString());
    var eleP = document.getElementById('p' + index.toString());
    var btnTa = document.getElementById('btnEdit' + index.toString());
    var btnP = document.getElementById('btnCancel' + index.toString());
    if (eleTa != null && eleP != null && btnTa != null && btnP != null) {
      if (btnTa.textContent == 'Edit') {
        if (eleTa.classList.contains('tw-hidden')) {
          eleTa.classList.remove("tw-hidden");
          eleP.classList.add("tw-hidden");
          btnTa.textContent = 'Save';
          btnP.classList.remove("tw-hidden");
          this.isEditing = true;
        }
      }
      else {
        this.sendFeedback();
      }

    }
  }

  cancelEditMode(index: number): void {
    var eleTa = document.getElementById('textarea' + index.toString());
    var eleP = document.getElementById('p' + index.toString());
    var btnTa = document.getElementById('btnEdit' + index.toString());
    var btnP = document.getElementById('btnCancel' + index.toString());
    if (eleTa != null && eleP != null && btnTa != null && btnP != null) {
      if (eleP.classList.contains('tw-hidden')) {
        eleTa.classList.add("tw-hidden");
        eleP.classList.remove("tw-hidden");
        btnP.classList.add("tw-hidden");
        btnTa.textContent = 'Edit';
        this.isEditing = false;
        this.changeStars((this.stars - 1) + "");
      }
    }
  }

  @Input() public arr: number[] = [1, 2, 3, 4, 5];

  @Input() i: number;

  @Input() type: string;

  @Input() stars: number;

  @Input() rating: Rating;

  createArray(n: number): number[] {
    var arr: number[] = [];
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
    return arr;
  }

  checkDateExpired(date: string): boolean {
    if (new Date().getTime() - new Date(date).getTime() > 604800000) {
      return true;
    }
    return false;
  }

  convertDateTime(date: string): string {
    if (date != undefined) {
      var dte = new Date(date);
      return (dte.getHours() < 10 ? "0" + dte.getHours() : dte.getHours()) + ":" + (dte.getMinutes() < 10 ? "0" + dte.getMinutes() : dte.getMinutes()) + ", " + (dte.getDate() < 10 ? "0" + dte.getDate() : dte.getDate()) + "/" +
        (dte.getMonth() + 1 < 10 ? "0" + (dte.getMonth() + 1) : dte.getMonth() + 1) + "/" +
        dte.getFullYear();
    } else {
      return "";
    }
  }

}
