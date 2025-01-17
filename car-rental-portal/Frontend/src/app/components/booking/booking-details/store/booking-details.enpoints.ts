import { environment } from "../../../../../environments/environment";

export const bookingDetailsEnpoints = {
    baseURL: `${environment.apiBaseUrl}/booking`,
    getBookingById: '/user-booking'
}