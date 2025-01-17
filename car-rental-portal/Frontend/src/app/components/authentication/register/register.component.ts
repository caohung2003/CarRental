import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import $ from "jquery";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ErrorsService } from '../../../services/errors.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// FormsModule,
//     ReactiveFormsModule,
//     CommonModule,
//     RouterModule,
//     NgbTooltipModule
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgbTooltipModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  //get element in file .html
  @ViewChild('fnameInput') fnameInput!: ElementRef;
  @ViewChild('lnameInput') lnameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('pwdInput') pwdInput!: ElementRef;
  @ViewChild('cfpwdInput') cfpwdInput!: ElementRef;
  @ViewChild('fnameMsg') fnameMsg!: ElementRef;
  @ViewChild('lnameMsg') lnameMsg!: ElementRef;
  @ViewChild('emailMsg') emailMsg!: ElementRef;
  @ViewChild('pwdMsg') pwdMsg!: ElementRef;
  @ViewChild('cfpwdMsg') cfpwdMsg!: ElementRef;


  // constraint
  maxName = 50;
  minName = 2;
  maxLengthEmail = 60;
  minLengthPass = 8;

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(this.minName), Validators.maxLength(this.maxName)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(this.minName), Validators.maxLength(this.maxName)]),
    email: new FormControl('', [Validators.required, Validators.maxLength(this.maxLengthEmail), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPass), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private title: Title,
    private errorService: ErrorsService,
    private storageService: StorageService,
    private authService: AuthService
  ) {
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

  checkConfirmPassword() {
    let pt = this.pwdInput.nativeElement.value;
    let ct = this.cfpwdInput.nativeElement.value;
    return (pt != null && ct != null) ? ct == pt : false;
  }

  submit() {
    this.form.markAllAsTouched();
    //Check form invalid
    if (!this.checkConfirmPassword() || this.form.invalid) {

      let et = this.emailInput.nativeElement.value;
      let pt = this.pwdInput.nativeElement.value;
      let ct = this.cfpwdInput.nativeElement.value;

      //first name error
      if (this.findInvalidControls('firstName')) {
        this.fnameInput.nativeElement.style = 'border-color: red';
        let fnameError = 'Length must be between ' + this.minName + ' and ' + this.maxName;
        this.fnameMsg.nativeElement.innerHTML = fnameError;
      }

      //last name error
      if (this.findInvalidControls('lastName')) {
        this.lnameInput.nativeElement.style = 'border-color: red';
        let lnameError = 'Length must be between ' + this.minName + ' and ' + this.maxName;
        this.lnameMsg.nativeElement.innerHTML = lnameError;
      }

      //email error
      if (this.findInvalidControls('email')) {
        this.emailInput.nativeElement.style = 'border-color: red;';
        let emailError = 'Invalid email';
        // if (et.length > this.maxLengthEmail) {
        //   emailError = 'Email must not exceed ' + this.maxLengthEmail + ' characters';
        // }
        if (et.length == 0) {
          emailError = 'Please enter your email';
        }
        this.emailMsg.nativeElement.innerHTML = emailError;
      }

      //password error
      if (this.findInvalidControls('password')) {
        this.pwdInput.nativeElement.style = 'border-color: red;';
        let pwdError = "Invalid password";
        if (pt.length == 0) {
          pwdError = 'Please enter your password';
        }
        this.pwdMsg.nativeElement.innerHTML = pwdError;
      }

      //confirm password not match
      if (!this.checkConfirmPassword()) {
        this.cfpwdInput.nativeElement.style = 'border-color: red;';
        let cfpwdError = 'Confirm password does not match';
        if (ct.length == 0) {
          cfpwdError = 'Please enter confirm password';
        }
        this.cfpwdMsg.nativeElement.innerHTML = cfpwdError;
      }
      return;
    }

    // console.log('form value', this.form);

    //Show swal loading
    this.errorService.loading();
    //Call api create user
    this.authService.save(this.form.value).subscribe((response: any) => {
      this.errorService.hideSwal();
      //Success: redirect to login
      this.router.navigate(['/login']);
      this.errorService.showSwalToastMessage('success', 'Register success! Please check your email.', 'top-end', 2000);
    }, error => {
      let message = "";
      if (error.status == 0) {
        // System error
        message = "System error, please try again later.";
      } else if (error.error.errorMessage != null && error.error.errorMessage != '')
        message = error.error.errorMessage;
      else
        message = 'Invalid data input. Try again.'
      this.errorService.hideSwal();
      //Register again
      this.router.navigate(['/register']);
      this.errorService.showSwalToastMessage('error', message, 'top-right', 5000);

    });
  }

  ngOnInit() {
    this.holder();
  }

  checkSelectorExistence(selectorName: string) {
    if ($(selectorName).length <= 0) {
      return false;
    } else {
      return true;
    }
  };

  clearMessage() {
    this.fnameInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.fnameMsg.nativeElement.innerHTML = '';
    this.lnameInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.lnameMsg.nativeElement.innerHTML = '';
    this.emailInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.emailMsg.nativeElement.innerHTML = '';
    this.pwdInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.pwdMsg.nativeElement.innerHTML = '';
    this.cfpwdInput.nativeElement.style = 'border-color: rgba(0, 0, 0, 0.2);';
    this.cfpwdMsg.nativeElement.innerHTML = '';
  }

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
  }
}
