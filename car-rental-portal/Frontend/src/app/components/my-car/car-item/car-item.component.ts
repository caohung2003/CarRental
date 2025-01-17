import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from "flowbite";
import { MyCar } from "../../../models/interfaces/my-car";
import { NgIf } from "@angular/common";
import { BookingService } from "../../../services/booking.service";
import { Router } from "@angular/router";
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective
} from "@coreui/angular";
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component";
import Swal from 'sweetalert2';
import { CarService } from '../../../services/car.service';
import { ErrorsService } from '../../../services/errors.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-car-item',
  standalone: true,
  imports: [NgIf, ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, CarouselComponent],
  templateUrl: './car-item.component.html',
  styleUrl: './car-item.component.css'
})
export class CarItemComponent implements OnInit {
  toggleVisibleRent() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to rent this car. This will make this car available for search and rent by other people ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carService.enableCar(this.car.id).subscribe(
          (response: any) => {
            this.car.status = 'AVAILABLE';
            this.errorService.showSwalToastMessage('success', 'Rent car successful', 'top-right', 2000);
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
        )
      }
    });

  }
  @Input() public car: MyCar;
  @Input() public index: number;

  ngOnInit(): void {
    initFlowbite();
  }
  constructor(
    private bookingService: BookingService,
    private route: Router,
    private carService: CarService,
    private errorService: ErrorsService,
    private authService: AuthService) {
  }

  @ViewChild('option') option!: ElementRef;

  showOption() {
    if (this.option.nativeElement.classList.contains('tw-hidden')) {
      this.option.nativeElement.classList.remove('tw-hidden');
    } else {
      this.option.nativeElement.classList.add('tw-hidden');
    }
  }

  convertMoney(number: number): string {
    // Chuyển số thành chuỗi và ngược lại để dễ xử lý
    let numString: string = String(number);

    // Mảng để lưu trữ các phần tử sau khi được chia nhỏ
    const parts: string[] = [];

    // Tách chuỗi thành các phần từ có độ dài là 3
    while (numString.length > 3) {
      parts.unshift(numString.slice(-3)); // Thêm phần tử vào đầu mảng
      numString = numString.slice(0, -3); // Loại bỏ 3 ký tự cuối
    }

    // Thêm phần tử cuối cùng vào mảng
    parts.unshift(numString);

    // Kết hợp các phần tử bằng dấu chấm
    return parts.join('.');
  }

  modal(id: number) {
    this.bookingService.getNumberOfPendingRequest(id).subscribe(
      (response: any) => {
        if (response == 0) {
          this.route.navigate(['/car-booking/Inprogress/' + id])
        }
        else {
          this.route.navigate(['/car-booking/Pending/' + id])
        }
      }
    )
  }

  stopRent() {

  }

  showOptionBooking() {
    var a = document.getElementById("option" + this.index);
    if (a != null) {
      if (a.classList.contains("tw-hidden")) {
        a.classList.remove("tw-hidden");
      }
      else {
        a.classList.add("tw-hidden");
      }
    }
  }

  public visibleConfirm: boolean = false;

  handleVisibleConfirm(event: any) {
    this.visibleConfirm = event;
  }

  public cancelCountdown: number = 5;
  timer: any;

  toggleVisibleConfirm() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to stop rent this car. This will make this car can not be searched and rented by other people. Also, all current bookings on this car will still be continued',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carService.disabledCar(this.car.id).subscribe(
          (response: any) => {
            this.car.status = 'STOPPED';
            this.errorService.showSwalToastMessage('success', 'Stop rent car successful', 'top-right', 2000);
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
        )
      }
    });

  }

  stopCountdown() {
    clearInterval(this.timer);
    var a = document.getElementById("decline" + this.index);
    var b = document.getElementById("ct" + this.index);
    if (a != null && b != null) {
      a.ariaDisabled = "false";
      a.classList.remove("disabled");
      b.style.display = "none";
      (document.getElementById("decline" + this.index) as HTMLButtonElement).disabled = false;
    }
  }

  detail(id: number) {
    window.open(this.route.createUrlTree(['/view-car/' + id], { queryParams: {} }).toString(), '_blank');

  }
}
