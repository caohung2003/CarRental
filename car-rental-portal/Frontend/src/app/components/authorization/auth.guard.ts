import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { STORAGE_TOKEN } from '../../constants/STORAGE-CONSTANT';

@Injectable()
export class AuthGuardService {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const accessToken = localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
    //Check if user is authorized or not
    if (accessToken === null){
        this.router.navigate(['/login']);
        return of(false);
    }
    //Check if user go the the /booking page or not
    if(state.url.endsWith('/booking')){
        this.router.navigate(['/home']);
        return of(false);
    }

    
    return this.userService.getUserInfo(accessToken).pipe(
      map((userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        return true;
      }),
      catchError(() => of(false))
    );
  }
}

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthGuardService).canActivate(route, state);
};
