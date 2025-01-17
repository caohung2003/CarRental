export interface IUserLoginState {
    loading: boolean;
    success: boolean;
    fail: boolean;
    userName: string;
}
export interface IUserState {
    login: IUserLoginState;
}

