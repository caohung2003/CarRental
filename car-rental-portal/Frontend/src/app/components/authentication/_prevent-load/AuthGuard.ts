import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, GuardResult, MaybeAsync } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { STORAGE_TOKEN } from "../../../constants/STORAGE-CONSTANT";
import { Observable, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.storageService.get(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY)) {
            return of(true); // Fixed line
        }
        return new Observable<boolean>((observer) => {
            this.authService.getUserInfo().subscribe(
                (userInfo: any) => {
                    if (userInfo && typeof userInfo === 'object' && userInfo.role === 'ADMIN' && this.router.url !== '/car-manage'
                        && !this.router.url.startsWith('/view-car/') && !this.router.url.startsWith('/add-car')) {
                        this.router.navigate(['/404'], { skipLocationChange: true });
                        observer.next(false);
                    } else {
                        observer.next(true);
                    }
                    observer.complete();
                },
                (error: any) => {
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    observer.next(false);
                    observer.complete();
                }
            );
        });
    }
}