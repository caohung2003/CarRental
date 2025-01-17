import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormCarCalendar } from '../../../models/interfaces/form-carcalendar';
import Swal from 'sweetalert2';
import { CarService } from '../../../services/car.service';
import { ErrorsService } from '../../../services/errors.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approve-step',
  standalone: true,
  imports: [],
  templateUrl: './approve-step.component.html',
  styleUrl: './approve-step.component.css'
})
export class ApproveStepComponent {
  @Output() updateData: EventEmitter<string> = new EventEmitter();

  @Output() sendFormCarCalendar: EventEmitter<FormCarCalendar> = new EventEmitter();

  @Input() formCarCalendar: FormCarCalendar;

  public previousPage() {
    this.sendFormCarCalendar.emit(this.formCarCalendar);
    this.updateData.emit("3");
  }

  constructor(private carService: CarService, private errorService: ErrorsService, private route: Router, private authService: AuthService) {

  }

  @Input() carId: number;

  declinedReason: string = '';
  decline() {
    Swal.fire({
      title: 'Confirmation',
      html: `Are you sure you want to decline this car ? Please give us your reasons <br/><input id = "reason" style = "margin-top: 20px; width: 90%; border-radius: 10px" class="input" type="text" required placeholder="Reason...">`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No',
      inputAttributes: {
        input: 'text',
        required: 'true'
      },
      confirmButtonColor: '#007bff',
      preConfirm: function () {
        var a = document.getElementById('reason') as HTMLInputElement;
        if (a != null) {
          if (a.value == '') {
            Swal.showValidationMessage("Please give us your reason");
          }
        }
        return new Promise((resolve, reject) => {
          resolve({
            Reason: $('input[placeholder="Reason..."]').val()
          });

          // maybe also reject() on some condition
        });
      }
    }).then((data: any) => {
      // your input data object will be usable from here
      this.declinedReason = data.value.Reason;
      this.carService.declineCar(this.carId, this.declinedReason).subscribe(
        (resposne: any) => {
          this.errorService.showSwalToastMessage('success', "Decline success", 'top-right', 2000);
          this.route.navigate(['/car-manage']);
        },
        (error: HttpErrorResponse) => {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      );

    });

  }

  insuranceStatus: boolean = false;

  approveInsurance() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Please confirm this car insurance status. It is valid or not',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, it is valid',
      cancelButtonText: 'No, it is not valid',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.insuranceStatus = true;
      }

      this.carService.approveCar(this.carId, this.insuranceStatus).subscribe(
        (resposne: any) => {

          this.errorService.showSwalToastMessage('success', "Approve success", 'top-right', 2000);
          this.route.navigate(['/car-manage']);
        },
        (error: HttpErrorResponse) => {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      );

    });
  }

  approveCar() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to approve for this car. This will make this car available for booking process',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveInsurance();

      }
    });
  }
}
