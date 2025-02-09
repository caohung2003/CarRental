export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    dob: Date,
    phone: string,
    avatar: FormData,
    role: string,
    rating: number,
    noBooking: number,
    nationalId: string,
    address: string,
    wardId: number,
    driverLicenseImage: FormData,
}