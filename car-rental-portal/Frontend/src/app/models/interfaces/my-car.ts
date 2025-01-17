import {Location} from "./location";

export interface MyCar{
  id:number,
  front: string,
  back: string,
  left: string,
  right: string,
  brand: string,
  model: string,
  rating: number,
  seat: number,
  price: number,
  transmission: string,
  rides: number,
  fuel: string,
  consumption: number,
  mileage:number,
  deposit: number,
  insurance_status: boolean,
  requests: number,
  license: string,
  status: string,
  images?: string[],
  startDate?: string,
  endDate?: string,
  ownerId?: number,
  ownerName?: string,
  ownerPhone?: string,
  ownerEmail?: string,
  ownerAvatar?: string,
  road?: string,
  createdAt?: string,
  updatedAt?: string,
  declinedReason?: string
}
