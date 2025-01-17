import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StorageService } from '../../services/storage.service';
import { ErrorsService } from '../../services/errors.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TopUpComponent } from '../top-up/top-up.component';
import { HttpErrorResponse } from '@angular/common/http';
import { WalletService } from '../../services/wallet.service';
import { endpoints } from '../../constants/end-points';
import { environment } from '../../../environments/environment';

export enum PAYMENT_METHOD {
  WALLET = 'WALLET',
  BANKING = 'BANKING',
  CASH = 'CASH',
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, HeaderComponent, FooterComponent, TopUpComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  topUp() {
    var a = this.amount - this.balances;
    if(a > 20000000) {
      a = 20000000;
    }
    //console.log(this.router.url);
    this.createPayment(a, this.router.url);
  }

  public isTopUp: boolean = false;
  option: number = 1;
  disable: boolean = true;
  public booking_id: string;
  public balances: number = 0;
  public amount: number = 0;
  public bookingId: string = '';
  public method = [];
  public name = 'Tran Hai Bang';
  public msg = '';
  public returnedUrl = this.route.url;
  isLoading = true;
  public type = 'deposit'



  createPayment(amount: number, returnedUrl: string) {
    
    return this.walletService.createPayment(amount, returnedUrl).subscribe(
      (response: any) => {
        window.open(response, '_self');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private storageService: StorageService,
    private errorService: ErrorsService,
    private walletService: WalletService
  ) {
    if (storageService.get('userInfo')) {
      this.name = storageService.get('userInfo').firstName + " " + storageService.get('userInfo').lastName;
    }
    let booking_id = this.route.snapshot.paramMap.get('booking_id');
    this.type = this.route.snapshot.paramMap.get('type') || '';
    if (this.type == 'deposit' || this.type == 'pm') {

      if (this.type == 'deposit') {
        this.getDepositDetail(booking_id);
        this.msg = 'Pay Deposit';
      } else {
        this.getPaymentDetail(booking_id);
        this.msg = 'Payment';
      }
    }
  }
  async ngOnInit(): Promise<void> {
  }

  changeTerm() {
    this.disable = !this.disable;
  }

  changeOpt(x: number) {
    this.option = x;
    switch (x) {
      case 1:
        if (this.amount > this.balances) this.disable = true;
        else this.disable = false;
        break;
      case 2:
        break;
      case 3:
        this.disable = true;
        break;
    }
  }

  getDepositDetail(booking_id: any) {
    this.isLoading = true;
    let load = true;
    this.bookingService.getDepositInfo(booking_id).subscribe(
      (response: any) => {
        console.log(response);
        this.balances = response.availableBalance;
        this.amount = response.amount;
        this.method = response.paymentTypesAvailable;
        this.bookingId = response.bookingId;
        if (this.amount > this.balances) this.disable = true;
        else this.disable = false;
        this.isLoading = false; // Set isLoading to false when the response is received successfully
      }, error => {
        console.error('Error occurred:', error);
        load = false;
        this.router.navigate(['/404'], { skipLocationChange: true });
      },
      () => {
        if (!load) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      });
  }

  getPaymentDetail(booking_id: any) {
    this.isLoading = true;
    this.bookingService.getPaymentInfo(booking_id).subscribe(
      (response: any) => {
        console.log(response);
        this.balances = response.availableBalance;
        this.amount = response.amount;
        this.method = response.paymentTypesAvailable;
        this.bookingId = response.bookingId;
        if (this.amount > this.balances) this.disable = true;
        else this.disable = false;
        this.isLoading = false; // Set isLoading to false when the response is received successfully
      },
      (error: any) => {
        console.error('Error occurred:', error);
        this.isLoading = false; // Set isLoading to false in case of error as well
        setTimeout(() => {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }, 0); // Delay the navigation to ensure it happens after the current digest cycle
      }
    );
  }

  // getBookingInfo(booking_id: any) {
  //   let load = true;
  //   this.isLoading = true;
  //   this.bookingService.getBookingByIdP(booking_id).subscribe(
  //     (response: any) => {
  //       this.status = response.status;
  //       this.getPaymentDetail(booking_id);
  //     },
  //     (error: any) => {
  //       load = false;
  //       console.error('Error occurred:', error);
  //     },
  //     () => {
  //       if (!load) {
  //         this.router.navigate(['/404'], { skipLocationChange: true });
  //       } else {
  //         this.isLoading = false;
  //       }
  //     }
  //   );
  // }

  submit() {
    let method = '';
    switch (this.option) {
      case 1:
        method = PAYMENT_METHOD.WALLET;
        break;
      case 2:
        method = PAYMENT_METHOD.BANKING;
        break;
      case 3:
        method = PAYMENT_METHOD.CASH;
        break;
    }
    if (this.type == 'deposit') {
      this.bookingService.pay_deposit(this.bookingId, method).subscribe(
        (response: any) => {
          this.errorService.showSwalToastMessage('success', 'Pay deposit successful', 'top-end', 5000);
          this.router.navigate(['/mybooking']);
        },
        (error: any) => {
          this.errorService.showSwalToastMessage('error', 'This booking not exist. Reload page for get latest status', 'top-end', 5000);
          this.router.navigate(['/mybooking']);
        }
      )
    } else {
      this.bookingService.payment(this.bookingId, method).subscribe(
        (response: any) => {
          this.errorService.showSwalToastMessage('success', 'Payment successful', 'top-end', 5000);
          this.router.navigate(['/mybooking']);
        },
        (error: any) => {
          this.errorService.showSwalToastMessage('error', 'This booking not exist. Reload page for get latest status', 'top-end', 5000);
          this.router.navigate(['/mybooking']);
        }
      )
    }

  }
}
