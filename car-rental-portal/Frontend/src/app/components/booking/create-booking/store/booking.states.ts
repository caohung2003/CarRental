import { BookingBasicInfo } from "../../../../models/entities/booking.model";

export interface IBookingInfoStates {
  renterInfo: BookingBasicInfo,
  driverInfo:BookingBasicInfo,
  pickUpDate: Date,
  returnDate: Date,
  pickUpCity: string,
  pickUpDistrict :string,
  pickUpWardId: string,
  pickUpStreet: string,
  carId:number
}
