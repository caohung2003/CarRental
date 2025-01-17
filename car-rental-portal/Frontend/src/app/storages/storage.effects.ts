import { Injectable } from "@angular/core";
import { Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from "../services/auth.service";

import * as fromUser from '../services/auth.service';

@Injectable()
export class UserEffects {
    constructor(private actions: Actions, private userService: AuthService) {

    }
    @Effect()
    login$ = this.actions.pipe(
        ofType<fromUser.Login>(fromUser.EUserActions.LOGIN),
        switchMap(action => {
            const { email, password } = action.payload;
            return this.userService.login(email, password).pipe(
                map(res => new fromUser.LoginSuccess(email)),
                catchError(e => of(new fromUser.LoginFail()))
            );
        })
    );
};
