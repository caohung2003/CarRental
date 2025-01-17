import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild, viewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { displayErrorMessage } from '../../../shared/messages/errorsMessage';
import { displaySuccessMessage } from '../../../shared/messages/successMessage';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  imports: [FormsModule, CommonModule, AsyncPipe, NgbTooltipModule],
  providers: [AuthService],
})
export class ResetPasswordComponent implements OnDestroy {
  @ViewChild('f') resetPasswordForm: NgForm = null!;
  @ViewChild('newPassword') newPassword: NgModel = null!;
  
  isDisplayPassword:boolean = false;
  isDisplayRepassword:boolean = false;

  newPasswordHasFocus=false;
  rePasswordHasFocus = false;

  private paramSubscription: Subscription;
  private changePasswordSubsciption:Subscription;
  private key:string;

    constructor(private authService: AuthService, private route: ActivatedRoute, private router:Router) {
      this.paramSubscription = this.route.queryParams.subscribe({
        next: (data) => {
          //check if the key value is existed or not
          if(data['key']===undefined||data['key']===null){
            displayErrorMessage('Error: the link is invalid!')
            this.router.navigate(['/home']);
          }
          else{
            this.authService.checkVerificationKey(data['key']).subscribe({
              next: (output) => {
                //check if the key is valid or not
                if(output)
                  this.key=data['key'];
                else{
                  displayErrorMessage('Error: the link is invalid!');
                  this.router.navigate(['/home']);
                }
              }
            })
          }
        },
        error: (error) => {
          displayErrorMessage(error);
        },
      });
  }

  onSubmit() {    
    this.changePasswordSubsciption = this.authService.resetPassword(this.key, this.newPassword.value).pipe(take(1)).subscribe({
      next: (data) => {
        if(data){
          displaySuccessMessage('Reset password successfully, please login');
          this.router.navigate(['/login']);
        }else{
          displayErrorMessage('Reset password failed');
        }
      },
      error: () => {
        displaySuccessMessage('An error occurred');
      }
    });
  }

  togglePassword(){
    this.isDisplayPassword = !this.isDisplayPassword;
  }

  toggleRepassword(){
    this.isDisplayRepassword = !this.isDisplayRepassword;
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) this.paramSubscription.unsubscribe();
  }
}
