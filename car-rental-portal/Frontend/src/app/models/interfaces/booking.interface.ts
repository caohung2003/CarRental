import { BookingBasicInfo } from "../entities/booking.model";

export interface UserBookingInfo{
    renterInfo: BookingBasicInfo,
    driverInfo: BookingBasicInfo
}