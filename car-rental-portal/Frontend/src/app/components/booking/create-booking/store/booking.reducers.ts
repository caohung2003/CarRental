import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';
import { BookingBasicInfo } from '../../../../models/entities/booking.model';

const bookingInfoInitialState = {
  renterInfo: new BookingBasicInfo(),
  driverInfo: new BookingBasicInfo(),
  pickUpDate: new Date(),
  returnDate: new Date(),
  pickUpWardId: '',
  pickUpStreet: '',
  pickUpCity: '',
  pickUpDistrict: '',
  carId: -1,
};

export const bookingInfoReducer = createReducer(
  bookingInfoInitialState,
  on(
    BookingActions.changeBookingInfo,
    (
      state,
      {
        renterInfo,
        driverInfo,
        pickUpDate,
        returnDate,
        pickUpCity,
        pickUpDistrict,
        pickUpWardId,
        pickUpStreet,
        carId,
      }
    ) => ({
      ...state,
      renterInfo,
      driverInfo,
      pickUpDate,
      returnDate,
      pickUpCity,
      pickUpDistrict,
      pickUpWardId,
      pickUpStreet,
      carId,
    })
  )
);
