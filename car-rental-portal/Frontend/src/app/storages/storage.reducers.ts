import {
  ActionReducer,
  ActionReducerMap,
  INIT,
  MetaReducer,
  UPDATE,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';
import { User } from '../models/entities/user.model';
import {
  changeAccessToken,
  changeRefreshToken,
  changeUserInfo,
} from './storage.actions';
import { IBookingInfoStates } from '../components/booking/create-booking/store/booking.states';
import { bookingInfoReducer } from '../components/booking/create-booking/store/booking.reducers';

interface IAuthState {
  accessToken: string;
  refreshToken: string;
}

interface IUserInfo {
  user: User;
}

export interface IAppState {
  auth: IAuthState;
  user: IUserInfo;
  bookingInfo: IBookingInfoStates;
}

const userInitialState: IUserInfo = { user: new User() };
export const userReducer = createReducer(
  userInitialState,
  on(changeUserInfo, (state, newUserInfo) => ({ user: newUserInfo }))
);

const authInitialState: IAuthState = {
  accessToken: '',
  refreshToken: '',
};
const authReducer = createReducer(
  authInitialState,
  on(changeAccessToken, (state, { newAccessToken }) => ({
    ...state,
    accessToken: newAccessToken,
  })),
  on(changeRefreshToken, (state, { newRefreshToken }) => ({
    ...state,
    refreshToken: newRefreshToken,
  }))
);

export const reducers: ActionReducerMap<IAppState> = {
  auth: authReducer,
  user: userReducer,
  bookingInfo: bookingInfoReducer,
};
