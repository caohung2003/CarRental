import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, TooltipModule } from "@coreui/angular";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/entities/user.model";
import { displayErrorMessage } from "../../../shared/messages/errorsMessage";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

@Component({
    standalone: true,
    styleUrl: './change-password.component.scss',
    templateUrl: './change-password.component.html',
    imports: [ModalComponent, ModalFooterComponent, ModalBodyComponent, ModalHeaderComponent, CommonModule, ReactiveFormsModule, TooltipModule, FormsModule],
    selector: 'change-password'
})
export class ChangePasswordComponent implements OnInit {
    visible = false;
    changePasswordForm:FormGroup;

    constructor(private formBuilder:FormBuilder, private authService:AuthService) {
    }

    ngOnInit(): void {
        //create password form
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
            retypeNewPassword: ['', Validators.required]
        }, {
            validator: this.passwordMatchValidator
        })
    }

    toggleChangePasswordForm() {
        this.visible = !this.visible;
    }

    handleChangePasswordForm(event: any) {
        this.visible = event;
    }

    onClickShowPassword(passwordInputControl: HTMLInputElement) {
        passwordInputControl.type =
          passwordInputControl.type === 'password' ? 'text' : 'password';
    }

    passwordMatchValidator(formGroup:FormGroup){
        const newPasswordControl = formGroup.get('newPassword');
        const retypeNewPasswordControl = formGroup.get('retypeNewPassword');

        if(newPasswordControl?.value !== retypeNewPasswordControl?.value){
            // console.log('passwordMisMatch = true');
            retypeNewPasswordControl?.setErrors({passwordMismatch:true});
        }else{
            retypeNewPasswordControl?.setErrors(null);
        }
    }

    patternValidator(pattern: RegExp):Observable<boolean>{
        return new Observable<false>
    }

    onSaveChange(){
        this.changePasswordForm.markAllAsTouched();
        if(this.changePasswordForm.valid)
            this.authService.changePassword(this.changePasswordForm.get('oldPassword')?.value,this.changePasswordForm.get('newPassword')?.value);
        else
            Swal.fire({
                toast: true,
                title: 'Error, please recheck your form',
                icon: 'error',
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            })
    }
}
