import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective
} from "@coreui/angular";
import { WalletService } from '../../services/wallet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../services/errors.service';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [CommonModule, LoadingComponent, FormsModule, RouterLink, ModalComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent, ButtonDirective, ModalToggleDirective, ButtonCloseDirective],
  templateUrl: './top-up.component.html',
  styleUrl: './top-up.component.css'
})
export class TopUpComponent implements OnInit {
  @Output() updateData: EventEmitter<string> = new EventEmitter();

  constructor(private walletService: WalletService, private route: Router, private router: ActivatedRoute, private errorService: ErrorsService, private authService: AuthService) {

  }

  isLoading: boolean = true;
  @Input() returnedUrl: any = "";

  async ngOnInit(): Promise<void> {
    let amount = "";
    let transactionCode: string = "";
    let responseCode: string = "";
    let returnedUrl: string = "";
    let url: string[] = window.location.href.split('?')[1].split('&');
    for (let i = 0; i < url.length; i++) {
      if (url[i].includes('vnp_TransactionNo')) {
        transactionCode = url[i].replaceAll('vnp_TransactionNo=', '');
      }
      else if (url[i].includes('vnp_ResponseCode')) {
        responseCode = url[i].replaceAll('vnp_ResponseCode=', '');
      }
      else if (url[i].includes('vnp_Amount')) {
        amount = url[i].replaceAll('vnp_Amount=', '');
      }
      else if (url[i].includes('redirect')) {
        returnedUrl = url[i].replaceAll('redirect=', '');
      }
    }

    if (amount != null) {
      if (responseCode == '00') {
        this.walletService.topUp(Number(amount) / 100, await this.generateUUIDFromString(transactionCode)).subscribe(
          (response: any) => {
            this.errorService.showSwalToastMessage('success', 'You have top up ' + Number(amount) / 100 + ' into you wallet', 'top-right', 2000);
            var a = returnedUrl.replaceAll('%2F', '/');
            this.isLoading = false;
            this.route.navigate([a]);
          },
          (error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.authService.logout(true, 'Phien dang nhap het han');
            } else if (error.status == 403) {
              this.route.navigate(['/403']);
            } else {
              this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
            }
            var a = returnedUrl.replaceAll('%2F', '/');
            this.isLoading = false;
            this.route.navigate([a]);

          }
        )
      }
      else {
        this.errorService.showSwalToastMessage('error', 'There was an error during your top up process. Please try again', 'top-right', 2000);
        var a = returnedUrl.replaceAll('%2F', '/');
        this.isLoading = false;
        this.route.navigate([a]);
      }
    }

  }

  createPayment() {
    return this.walletService.createPayment(this.amount).subscribe(
      (response: any) => {
        window.open(response, '_self');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  async generateUUIDFromString(string: string) {
    const uuid = await import('uuid-by-string').then(module => module.default(string));
    return uuid;
  }

  public getUuid = require('uuid-by-string');
  public visibleTopUp: boolean = true;

  public amount: number = 0;
  getAmount(am: number) {
    this.amount = am;
  }

  toggleTopUp() {
    this.amount = 0;
    //this.visibleTopUp = !this.visibleTopUp;
    //if(!this.visibleTopUp) {
    this.updateData.emit("false");
    //}
  }

  handleTopUpChange(event: any) {
    this.visibleTopUp = event;
  }


}
