import {User} from "../entities/user.model";

export interface BookingResponseBasic {
    id: number;
    userId: number;
    carId: number;
    pickUpDateTime: string;
    returnDateTime: string;
    basePrice: number;
    deposit: number;
    total: number;
    status: string;
    createdAt: string;
    numberOfDays: number;
    renterMessage?: string;
    carOwnerMessage?: string;
    paymentType: string;
    isRating: boolean,
    user?: User,
    carName?: string,
    carImage?: string,
    wardId?: number,
    road?: string,
    actualPickUp?: string;
    actualReturn?: string,
    message?: string
}
