import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  HttpErrorResponse,
} from '@angular/common/http';

import { Subscription, take } from 'rxjs';
import { User } from '../../../models/entities/user.model';
import { displayErrorMessage } from '../../../shared/messages/errorsMessage';
import { displaySuccessMessage } from '../../../shared/messages/successMessage';
import Swal from 'sweetalert2';
import { loading } from '../../../shared/messages/dialogMessage';
import { ErrorDTO } from '../../../models/interfaces/errors.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService],
})
export class ForgotPasswordFormComponent implements OnDestroy {
  @ViewChild('f') fogotPassForm: NgForm = null!;
  @ViewChild('emailControl') emailControl: NgModel = null!;

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
  }

  onSubmit() {
    this.authService.sendOTPToUserEmail(this.emailControl.value);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
