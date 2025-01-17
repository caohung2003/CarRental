import { createSelector } from "@ngrx/store";
import { ILocalStorage } from "../models/interfaces/storage.interface";

export const selectAccessToken = createSelector(
    (state:ILocalStorage) => state.token.accessToken,
    accessToken => accessToken
);

export const selectRefreshToken = createSelector(
    (state: ILocalStorage) => state.token.refreshToken,
    refreshToken => refreshToken
);

export const selectUser = createSelector(
    (state: ILocalStorage) => state.user,
    user => user
);