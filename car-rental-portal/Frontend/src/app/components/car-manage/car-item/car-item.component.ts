import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, CarouselComponent } from '@coreui/angular';
import { CarBasic } from '../../../models/interfaces/carbasic';
import { MyCar } from '../../../models/interfaces/my-car';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CarService } from '../../../services/car.service';
import { ErrorsService } from '../../../services/errors.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-car-item',
  standalone: true,
  imports: [NgIf, ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, CarouselComponent],
  templateUrl: './car-item.component.html',
  styleUrl: './car-item.component.css'
})
export class CarItemComponent {
  redirectToProfile(id: number | undefined) {
    if (id != undefined)
      this.route.navigate(['/profile/' + id]);
  }
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
      this.carService.declineCar(this.car.id, this.declinedReason).subscribe(
        (resposne: any) => {
          this.car.status = 'CANCELLED';
          this.cars.splice(this.index, this.index);
          this.errorService.showSwalToastMessage('success', "Decline success", 'top-right', 2000);
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

      this.carService.approveCar(this.car.id, this.insuranceStatus).subscribe(
        (resposne: any) => {

          this.car.status = 'AVAILABLE';
          this.cars.splice(this.index, this.index);
          this.errorService.showSwalToastMessage('success', "Approve success", 'top-right', 2000);
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



  @ViewChild('option') option!: ElementRef;

  @Input() public car: MyCar;
  @Input() public cars: MyCar[];
  @Input() public index: number;

  constructor(private route: Router, private carService: CarService, private errorService: ErrorsService) {

  }

  showOption() {
    if (this.option.nativeElement.classList.contains('tw-hidden')) {
      this.option.nativeElement.classList.remove('tw-hidden');
    } else {
      this.option.nativeElement.classList.add('tw-hidden');
    }
  }

  carDetail(id: number) {
    window.open(this.route.createUrlTree(['/view-car/' + id], { queryParams: {} }).toString(), '_blank');

  }
}
