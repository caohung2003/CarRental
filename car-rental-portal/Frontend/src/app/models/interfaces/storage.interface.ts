import { User } from "../entities/user.model"

export interface ILocalStorage{
    token: IAuth,
    user: User
}

export interface IAuth {
    accessToken: string,
    refreshToken: string
}