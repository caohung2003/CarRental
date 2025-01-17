import { Action, createAction, props } from "@ngrx/store"
import { User } from "../models/entities/user.model"

export const changeAccessToken = createAction (
    '[AccessToken] ChangeAccessToken',
    props<{newAccessToken:string}>()
)

export const changeRefreshToken = createAction (
    '[RefreshToken] ChangeRefreshToken',
    props<{newRefreshToken:string}>()
)

export const changeUserInfo = createAction(
    '[USER], ChangeUserInfo',
    props<User>()
)

// định nghĩa type cho user action
export enum EUserActions {
    LOGIN = '[USER] Login',
    LOGIN_SUCCESS = '[USER] Login Success',
    LOGIN_FAIL = '[USER] Login Fail'
}

export class Login implements Action {
    public readonly type = EUserActions.LOGIN;
    constructor(public payload: { email: string, password: string }) { }
}
export class LoginSuccess implements Action {
    public readonly type = EUserActions.LOGIN_SUCCESS;
    constructor(public payload: string) { }
}
export class LoginFail implements Action {
    public readonly type = EUserActions.LOGIN_FAIL;
    constructor() { }
}
export type UserActions = Login | LoginSuccess | LoginFail;
