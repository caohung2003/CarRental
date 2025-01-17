import { createAction, props } from "@ngrx/store";
import { IBookingInfoStates } from "./booking.states";
import { BookingBasicInfo } from "../../../../models/entities/booking.model";

export const changeBookingInfo = createAction('[Booking] Change booking info', props<IBookingInfoStates>())

export const changeRenterBookingInfo = createAction('[Booking Change renter info]', props<{renterInfo: BookingBasicInfo}>)