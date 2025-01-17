import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  alertHeader: string = "";
  alertContent: string = "";
  isSuccess: boolean = true;
  token: string = "";
  htmlToAdd: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorsService,
    private authService: AuthService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.token = "";
    this.route.queryParams
      .subscribe(params => {
        if (params['key'] != null && params['key'] != "") {
          // console.log(params); // { orderby: "price" }
          this.token = params['key'];
          // console.log("token: " + this.token)
        } else {
          this.router.navigate(['/404']);
        }
      }
      );
    this.checkVerify();
  }

  checkVerify() {
    this.authService.activate(this.token).subscribe((response: any) => {
      this.isSuccess = true;
      let message = "Verify success!";
      this.router.navigate(['/login']);
      this.errorService.showModalAlert('success', message, "");
    }, (error:HttpErrorResponse) => {
      this.isSuccess = false;
      this.alertHeader = "Verification failed"
      this.alertContent = "System error, please try again later";
      if (error.error.errorDetails != null) {
        this.alertContent = error.error.errorDetails + ". Check your email again to get link.";
      }
      this.router.navigate(['/login']);
      this.errorService.showModalAlert('error', this.alertContent, "");
    });
    // this.errorService.loading();
  }

  submit(check: boolean) {
    if (check) {
      this.checkVerify();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
