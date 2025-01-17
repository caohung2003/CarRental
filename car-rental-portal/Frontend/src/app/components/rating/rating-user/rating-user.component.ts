import {Component, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import {RatingService} from "../../../services/rating.service";
import {ErrorsService} from "../../../services/errors.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {RatingSend} from "../../../models/interfaces/rating-send";
import {User} from "../../../models/entities/user.model";
import {BookingResponseBasic} from "../../../models/interfaces/booking.response";
import {MatFormField} from "@angular/material/form-field";
import {MatDialog, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {AvatarModule} from "primeng/avatar";
import {AutoFocusModule} from "primeng/autofocus";
// import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent} from "@coreui/angular";

@Component({
    selector: 'app-rating-user',
    standalone: true,
  imports: [
    FormsModule,
    PaginatorModule,
    MatFormField,
    MatDialogContent,
    MatDialogClose,
    ButtonModule,
    DialogModule,
    AvatarModule,
    AutoFocusModule,
  ],
    templateUrl: './rating-user.component.html',
    styleUrl: './rating-user.component.css'
})
export class RatingUserComponent implements OnInit {
    public star: number = 0;
    public comment: string = "";

    @Input() public bookingId: number;
    @Input() public user: User | undefined;
    @Input() public index: string;
    @Input() public booking: BookingResponseBasic;

    constructor(private ratingService: RatingService,
                private errorService: ErrorsService,
                private authService: AuthService,
                private route: Router,
                public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {

    }


  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

    sendFeedback(value: any) {
        console.log(this.bookingId + " " + this.star + " " + this.comment);
        var feedback: RatingSend = {
            booking: {
                id: this.bookingId
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
                // if (error.status == 401) {
                //   this.authService.logout(true, 'Phien dang nhap het han');
                // } else if(error.status == 403) {
                //   this.route.navigate(['/403']);
                // } else {
                //   this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
                // }
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
        console.log(this.star);
    }

}
