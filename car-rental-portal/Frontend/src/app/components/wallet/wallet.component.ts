import { Component, OnInit } from '@angular/core';
import { Wallet } from '../../models/interfaces/wallet';
import { Transaction } from '../../models/interfaces/transaction';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { WalletService } from '../../services/wallet.service';
import { User } from '../../models/entities/user.model';
import { CommonModule } from '@angular/common';
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
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, RouterLink, ModalComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent, ButtonDirective, ModalToggleDirective, ButtonCloseDirective],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',

})
export class WalletComponent implements OnInit {
  createPayment() {

    return this.walletService.createPayment(this.amount,'/mywallet' ).subscribe(
      (response: any) => {
        window.open(response, '_self');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  public amount: number = 0;
  getAmount(am: number) {
    this.amount = am;
    //console.log(this.amount);
  }

  public wallet: Wallet;
  public getUuid = require('uuid-by-string');
  public visibleTopUp: boolean = false;
  public transactions: Transaction[] = [];
  filteredTransactions: Transaction[];
  selectedTransactionType: string = '';

  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number;
  totalTransactions: number;

  sortByDateAscending: boolean = false;
  sortByDateDescending: boolean = true;

  url = '';
  public arrPage: Array<number> = [];
  constructor(
    private walletService: WalletService,
    private router: ActivatedRoute,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router
  ) {
    this.url = this.route.url;

  }

  async generateUUIDFromString(string: string) {
    const uuid = await import('uuid-by-string').then(module => module.default(string));
    return uuid;
  }

  async ngOnInit(): Promise<void> {
    let amount = this.router.snapshot.paramMap.get('amount');
    let transactionCode: string = "";
    let responseCode: string = "";
    let url: string[] = window.location.href.split('&');
    for (let i = 0; i < url.length; i++) {
      if (url[i].includes('vnp_TransactionNo')) {
        transactionCode = url[i].replaceAll('vnp_TransactionNo=', '');
      }
      else if (url[i].includes('vnp_ResponseCode')) {
        responseCode = url[i].replaceAll('vnp_ResponseCode=', '');


      }
    }
    if (amount != null) {
      if (responseCode == '00') {
        // console.log(amount + " " + transactionCode);
        this.walletService.topUp(Number(amount) / 100, await this.generateUUIDFromString(transactionCode)).subscribe(
          (response: any) => {
            this.errorService.showSwalToastMessage('success', 'You have top up ' + Number(amount) / 100 + ' into you wallet', 'top-right', 2000);
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
      else {
        this.errorService.showSwalToastMessage('error', 'There was an error during your top up process. Please try again', 'top-right', 2000);
      }
    }






    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.wallet = {
      id: 0,
      user: new User(),
      pendingBalance: 0,
      availableBalance: 0,
    }
    this.getMyWallet();
    this.getMyTransaction();

  }

  switchPage(p: number) {
    this.currentPage = p;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  logout() {
    this.authService.logout(true);
  }

  getMyWallet(): void {
    this.walletService.getMyWallet().subscribe(
      (data: any) => {
        this.wallet = {
          id: data.id,
          user: new User(
            data.userDto.id,
            data.userDto.firstName,
            data.userDto.lastName,
            data.userDto.email,
            data.userDto.rating,
            data.userDto.avatar,
            data.userDto.noBooking
          ),
          pendingBalance: data.pendingBalance,
          availableBalance: data.availableBalance
        }
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
    );
  }

  toggleTopUp() {
    this.amount = 0;
    this.visibleTopUp = !this.visibleTopUp;
  }

  handleTopUpChange(event: any) {
    this.visibleTopUp = event;
  }

  getMyTransaction(): void {
    this.walletService.getMyTransaction().subscribe(
      (data: any) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          var transaction: Transaction = {
            id: data[i].id,
            transactionId: data[i].transactionId,
            amount: data[i].amount,
            message: data[i].message,
            date: data[i].timestamp,
            type: data[i].type,
            status: data[i].status,
            bookingId: data[i].bookingId,
            userId: data[i].userId,
          }
          this.transactions.push(transaction);
        }

        this.totalTransactions = this.transactions.length;
        this.totalPages = Math.ceil(this.totalTransactions / this.itemsPerPage);
        for(let i = 0; i < this.totalPages; i++){
          this.arrPage.push(i + 1);
        }
        // Call filterTransactions after transactions are loaded
        this.filterTransactions();
      }
    );
  }


  filterTransactions(): void {
    if (this.selectedTransactionType) {
      this.filteredTransactions = this.transactions.filter(
        (transaction) => transaction.type === this.selectedTransactionType
      );
    } else {
      this.filteredTransactions = [...this.transactions];
    }

    this.sortTransactionsByDate();

    // Reset current page to 1 whenever the filter changes
    this.currentPage = 0;

    // Recalculate total pages based on the new filtered transactions
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);

    this.totalTransactions = this.filteredTransactions.length;
  }

  getCurrentPageTransactions(): Transaction[] {
    const startIndex = (this.currentPage) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, endIndex);
  }

  changePage(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  sortTransactionsByDate(): void {
    this.filteredTransactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortByDateAscending ? dateA - dateB : dateB - dateA;
    });
  }


  toggleSortByDate(): void {
    this.sortByDateAscending = !this.sortByDateAscending;
    this.sortByDateDescending = !this.sortByDateDescending;

    this.sortTransactionsByDate();

    this.currentPage = 0;
  }
}
