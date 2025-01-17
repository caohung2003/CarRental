import { BrandModel } from './brand-model.model';
import { CarBusyCalendar } from './car-busy-calendar.model';
import { CarDetails } from './car-detail.model';
import { CarLocation } from './car-location.model';
import { CarPricing } from './car-pricing.model';
import { Feature } from './feature.model';
import { Profile } from './profile.model';

export enum Transmission {
  AUTOMATION = "Automation",
  MANUAL = "Manual",
}

export enum Fuel {
  GAS,
  DIESEL,
}

export class CarBasicInfo {
  private _id: number;
  private _licensePlate: string;
  private _brandModel: BrandModel;
  private _yearProduction: number;
  private _noSeat: number;
  private _transmission: Transmission;
  private _fuel: Fuel;
  private _registrationImgUrl: string;
  private _inspectionImgUrl: string;
  private _insuranceImgUrl: string;
  private _status: string;
  private _start: Date;
  private _end: Date;
  private _rating: number;
  private _noRides: number;
  private _carDetail: CarDetails;
  private _insuranceStatus: boolean;
  private _carCalendar: CarBusyCalendar[];
  private _carPricing: CarPricing;
  private _carLocations: CarLocation[];
  private _features: Set<Feature>;
  private _profileDto: Profile;

  constructor(
    id?: number,
    licensePlate?: string,
    brandModel?: BrandModel,
    yearProduction?: number,
    noSeat?: number,
    transmission?: Transmission,
    fuel?: Fuel,
    registrationImgUrl?: string,
    inspectionImgUrl?: string,
    insuranceImgUrl?: string,
    status?: string,
    start?: Date,
    end?: Date,
    rating?: number,
    noRides?: number,
    carDetail?: CarDetails,
    insuranceStatus?: boolean,
    carCalendar?: CarBusyCalendar[],
    carPricing?: CarPricing,
    carLocations?: CarLocation[],
    features?: Set<Feature>,
    profileDto?: Profile
  ) {
    this._id = id ?? -1;
    this._licensePlate = licensePlate ?? '';
    this._brandModel = brandModel ?? new BrandModel();
    this._yearProduction = yearProduction ?? -1;
    this._noSeat = noSeat ?? -1;
    this._transmission = transmission ?? Transmission.MANUAL;
    this._fuel = fuel ?? Fuel.GAS;
    this._registrationImgUrl = registrationImgUrl ?? '';
    this._inspectionImgUrl = inspectionImgUrl ?? '';
    this._insuranceImgUrl = insuranceImgUrl ?? '';
    this._status = status ?? '';
    this._start = start ?? new Date();
    this._end = end ?? new Date();
    this._rating = rating ?? -1;
    this._noRides = noRides ?? -1;
    this._carDetail = carDetail ?? new CarDetails();
    this._insuranceStatus = insuranceStatus ?? false;
    this._carCalendar = carCalendar ?? [];
    this._carPricing = carPricing ?? new CarPricing();
    this._carLocations = carLocations ?? [];
    this._features = features ?? new Set();
    this._profileDto = profileDto ?? new Profile();
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get licensePlate(): string {
    return this._licensePlate;
  }

  set licensePlate(licensePlate: string) {
    this._licensePlate = licensePlate;
  }

  get brandModel(): BrandModel {
    return this._brandModel;
  }

  set brandModel(brandModel: BrandModel) {
    this._brandModel = brandModel;
  }

  get yearProduction(): number {
    return this._yearProduction;
  }

  set yearProduction(yearProduction: number) {
    this._yearProduction = yearProduction;
  }

  get noSeat(): number {
    return this._noSeat;
  }

  set noSeat(noSeat: number) {
    this._noSeat = noSeat;
  }

  get transmission(): Transmission {
    return this._transmission;
  }

  set transmission(transmission: Transmission) {
    this._transmission = transmission;
  }

  get fuel(): Fuel {
    return this._fuel;
  }

  set fuel(fuel: Fuel) {
    this._fuel = fuel;
  }

  get registrationImgUrl(): string {
    return this._registrationImgUrl;
  }

  set registrationImgUrl(registrationImgUrl: string) {
    this._registrationImgUrl = registrationImgUrl;
  }

  get inspectionImgUrl(): string {
    return this._inspectionImgUrl;
  }

  set inspectionImgUrl(inspectionImgUrl: string) {
    this._inspectionImgUrl = inspectionImgUrl;
  }

  get insuranceImgUrl(): string {
    return this._insuranceImgUrl;
  }

  set insuranceImgUrl(insuranceImgUrl: string) {
    this._insuranceImgUrl = insuranceImgUrl;
  }

  get status(): string {
    return this._status;
  }

  set status(status: string) {
    this._status = status;
  }

  get start(): Date {
    return this._start;
  }

  set start(start: Date) {
    this._start = start;
  }

  get end(): Date {
    return this._end;
  }

  set end(end: Date) {
    this._end = end;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(rating: number) {
    this._rating = rating;
  }

  get noRides(): number {
    return this._noRides;
  }

  set noRides(noRides: number) {
    this._noRides = noRides;
  }

  get carDetail(): CarDetails {
    return this._carDetail;
  }

  set carDetail(carDetail: CarDetails) {
    this._carDetail = carDetail;
  }

  get insuranceStatus(): boolean {
    return this._insuranceStatus;
  }

  set insuranceStatus(insuranceStatus: boolean) {
    this._insuranceStatus = insuranceStatus;
  }

  get carCalendar(): CarBusyCalendar[] {
    return this._carCalendar;
  }

  set carCalendar(carCalendar: CarBusyCalendar[]) {
    this._carCalendar = carCalendar;
  }

  get carPricing(): CarPricing {
    return this._carPricing;
  }

  set carPricing(carPricing: CarPricing) {
    this._carPricing = carPricing;
  }

  get carLocations(): CarLocation[] {
    return this._carLocations;
  }

  set carLocations(carLocations: CarLocation[]) {
    this._carLocations = carLocations;
  }

  get features(): Set<Feature> {
    return this._features;
  }

  set features(features: Set<Feature>) {
    this._features = features;
  }

  get profileDto(): Profile {
    return this._profileDto;
  }

  set profile(profileDto: Profile) {
    this._profileDto = profileDto;
  }
}
