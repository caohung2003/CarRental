import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';


import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { ErrorsService } from '../../../services/errors.service';
import { StorageService } from '../../../services/storage.service';
import { CookiesService } from '../../../services/cookies.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { STORAGE_TOKEN } from '../../../constants/STORAGE-CONSTANT';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ForgotPasswordDialogComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit {

  //Get element in file .html
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('pwdInput') pwdInput!: ElementRef;
  @ViewChild('emailMsg') emailMsg!: ElementRef;
  @ViewChild('pwdMsg') pwdMsg!: ElementRef;

  //Constant constraint
  maxLengthEmail = 60;
  minLengthPass = 8;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(this.maxLengthEmail), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  });


  constructor(
    private http: HttpClient,
    private router: Router,
    private title: Title,
    private authService: AuthService,
    private errorService: ErrorsService,
    private storageService: StorageService,
    private cookies: CookiesService,
    private route: ActivatedRoute,
  ) {
    // this.checkLoggedIn();
  }

  ngOnInit() {
    this.holder();
    this.checkLoggedIn();
    let msg = this.router.url.split("/login")[1];
    if (msg != '' && msg.startsWith('/')) {
      msg = msg.substring(1, msg.length);
      this.errorService.showSwalToastMessage('warning', decodeURIComponent(msg), 'top-end', 5000);
    }
  }

  checkLoggedIn() {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.router.navigate(['/home']);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  findInvalidControls(element: string) {
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid && name === element) {
        return true;
      }
    }
    return false;
  }

  // Clear error message when click input form
  clearMessage() {
    this.emailInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.emailMsg.nativeElement.innerHTML = '';
    this.pwdInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.pwdMsg.nativeElement.innerHTML = '';
  }


  // Check and submit form
  submit(uncheck?: boolean) {
    this.clearMessage();
    if (uncheck == null && !uncheck) {
      this.form.markAllAsTouched();
      //Check form invalid
      if (this.form.invalid) {
        let emailError = '';
        let pwdError = '';

        let et = this.emailInput.nativeElement.value;
        let pt = this.pwdInput.nativeElement.value;

        //if email error
        if (et != null && this.findInvalidControls('email')) {
          this.emailInput.nativeElement.style = 'border-color: red;';
          //default: invalid pattern
          emailError = 'Invalid email';
          //error: > maxlength
          if (et.length > this.maxLengthEmail) {
            emailError = 'Email must not exceed ' + this.maxLengthEmail + ' characters';
          }
          //error: empty
          if (et.length == 0) {
            emailError = 'Please enter your email';
          }
          this.emailMsg.nativeElement.innerHTML = emailError;
        }

        //if password error
        if (pt != null && pt.length == 0 && this.findInvalidControls('password')) {
          this.pwdInput.nativeElement.style = 'border-color: red;';
          pwdError = 'Please enter your password';
          this.pwdMsg.nativeElement.innerHTML = pwdError;
        }

        return;
      }
    }
    //Show swal loading when call api, will disappear when api call successfully
    this.errorService.loading();

    //Call api authen info
    this.authService.authenticateLogin(this.form.value).subscribe((response: any) => {
      // console.log('response in login', response);
      // console.log('response status: ' + response.status);
      //Hide swal loading
      this.errorService.hideSwal();

      //If authen ok
      if (response.status == 200) {
        this.storageService.put(STORAGE_TOKEN .LOCAL_STORAGE_ACCESS_KEY, response.body.access_token);
        this.storageService.put(STORAGE_TOKEN .LOCAL_STORAGE_REFRESH_KEY, response.body.refresh_token);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigate([returnUrl]);
        // this.errorService.showSwalToastMessage('success', 'Login Succesfull', 'top-end', 2000);
      }
    }, error => {
      let message: string;
      // email of password not correct
      if (error.status != 0) {
        message = "Incorrect email or password";
      } else {
        // status == 0 (System error)
        message = "System error, please try again later";
      }
      this.errorService.hideSwal();
      // console.log('error in login ', error);
      //Login again
      this.router.navigate(['/login']);
      this.errorService.showSwalToastMessage('error', message, 'top-right', 2000);

    });
  }

  checkSelectorExistence(selectorName: string) {
    if ($(selectorName).length <= 0) {
      return false;
    } else {
      return true;
    }
  };

  holder() {
    if (!this.checkSelectorExistence('.placeani')) { return; }
    $('.placeani input, .placeani textarea').focus(function () {
      $(this).parents('.form-group').addClass('focused');
    });

    $('.placeani input, .placeani textarea').blur(function () {
      var inputValue = $(this).val();
      if (inputValue == "") {
        $(this).removeClass('filled');
        $(this).parents('.form-group').removeClass('focused');
      } else {
        $(this).addClass('filled');
      }
    });
  }

  reveal(toggle: string, view: string) {
    const togglePassword = document.querySelector(toggle);
    const password = document.querySelector(view);
    if (togglePassword != null && password != null) {
      // toggle the type attribute
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      // toggle the icon
      if (type === 'password') {
        togglePassword.classList.add("fa-eye");
        togglePassword.classList.remove("fa-eye-slash");
      } else {
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
      }
    }
    // prevent form submit
  }

  //Show swal enter email forgot
  forgotPwd() {
    this.errorService.showModalForgotWithApi();
    // this.errorService.showSwalToastMessage('info', 'Test');
  }
}
