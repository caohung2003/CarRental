import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { IBookingInfoStates } from './booking.states';
import { state } from '@angular/animations';

export const selectBookingInfo =
  createFeatureSelector<IBookingInfoStates>('bookingInfo');

export const selectRenterInfo = createSelector(
  selectBookingInfo,
  (state: IBookingInfoStates) => state.renterInfo
);

export const selectDriverInfo = createSelector(
  selectBookingInfo,
  (state: IBookingInfoStates) => state.driverInfo
)
;

export const selectPickUpDate = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.pickUpDate
);

export const selectReturnDate = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.returnDate
);

export const selectCarId = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.carId
);

export const selectPickUpCity = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.pickUpCity
);

export const selectPickUpWard = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.pickUpWardId
);

export const selectDistrict = createSelector(
  selectBookingInfo,
  (state:IBookingInfoStates) => state.pickUpDistrict
);