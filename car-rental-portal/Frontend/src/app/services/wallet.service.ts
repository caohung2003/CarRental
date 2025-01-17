import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../models/interfaces/wallet';
import { endpoints } from '../constants/end-points';
import { HttpService } from '../shared/http.service';
import { AuthService } from './auth.service';
import { ErrorsService } from './errors.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class WalletService {

    constructor(
        private http: HttpClient,
        private httpService: HttpService,
        private authService: AuthService,
        private errorService: ErrorsService,
        private route: Router,
        private router: ActivatedRoute,
    ) { }

    getMyWallet(): any {
        return this.httpService.getWithToken(endpoints.get_wallet_user);
    }

    getMyTransaction(): any {
        return this.httpService.getWithToken(endpoints.get_transaction_user);
    }

    createPayment(amount: number, returnedUrl?: string): any {
        if (returnedUrl == null)
            return this.httpService.getWithTokenResponseText(endpoints.create_payment + amount);
        else
            return this.httpService.getWithTokenResponseText(endpoints.create_payment + amount + "?returnedUrl=" + returnedUrl);
    }

    topUp(amount: number, transactionCode: string): any {
        return this.httpService.putWithToken(endpoints.top_up + amount + "?transactionCode=" + transactionCode);
    }

    confirmTopUp(transactionId: number) {
        return this.httpService.putWithToken(endpoints.confirm_top_up + transactionId);
    }

    confirmWithdraw(transactionId: number) {
        return this.httpService.putWithToken(endpoints.confirm_withdraw + transactionId);
    }

    getApprovalTransactions(type: string, sort: string, order: string, page: number, size: number, start: string, end: string) {
        if (sort != "") {
            return this.httpService.getWithToken(endpoints.list_approval_transaction + "?type=" + type + "&sort=" + sort + "&order=" + order + "&startDate=" + start + "&endDate=" + end + "&page=" + page + "&size=" + size);
        }
        else {
            return this.httpService.getWithToken(endpoints.list_approval_transaction + "?type=" + type + "&page=" + page + "&size=" + size + "&startDate=" + start + "&endDate=" + end);
        }
    }

    async generateUUIDFromString(string: string) {
        const uuid = await import('uuid-by-string').then(module => module.default(string));
        return uuid;
    }

   

}