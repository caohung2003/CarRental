import { environment } from "../../../../../environments/environment";

export const bookingEndPoints = {
    baseURL: `${environment.apiBaseUrl}/booking`,
    createBooking : '/create',
    getUserBooking: '/user-bookings',
    editBooking: '/edit'
}