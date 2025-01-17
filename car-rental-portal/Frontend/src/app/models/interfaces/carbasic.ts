import {Location} from "./location";

export interface CarBasic{
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
  location: Location[],
  transmission: string,
  rides: number,
  fuel: string,
  consumption: number,
  mileage:number,
  distance:number,
  lat: number,
  lng: number,
  deposit: number,
  description: string,
  features: string[],
  terms: string[],
  insurance_status: boolean,
  licensePlate?: string
}
