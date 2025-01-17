export enum Roles {
  ADMIN,
  USER,
}

export class User {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _dob: Date;
  private _phone: string;
  private _avatar: string;
  private _role: string;
  private _rating: number;
  private _noBooking: number;
  private _nationalId: string;
  private _address: string;
  private _wardId: number;
  private _driverLicenseImage: string;

  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    dob?: Date,
    phone?: string,
    avatar?: string,
    role?: string,
    rating?: number,
    noBooking?: number,
    nationalId?: string,
    address?: string,
    wardId?: number,
    driverLicenseImage?: string
  ) {
    this._id = id ?? 0;
    this._firstName = firstName ?? '';
    this._lastName = lastName ?? '';
    this._email = email ?? '';
    this._dob = dob ?? new Date();
    this._phone = phone ?? '';
    this._avatar = avatar ?? '';
    this._role = role ?? '';
    this._rating = rating ?? 0;
    this._noBooking = noBooking ?? 0;
    this._nationalId = nationalId ?? '';
    this._address = address ?? '';
    this._wardId = wardId ?? 0;
    this._driverLicenseImage = driverLicenseImage ?? '';
  }

  public get id() {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get firstName() {
    return this._firstName;
  }

  public set firstName(firstName: string) {
    this._firstName = firstName;
  }

  public get lastName() {
    return this._lastName;
  }

  public set lastName(lastName: string) {
    this._lastName = lastName;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get dob(): Date {
    return this._dob;
  }

  public set dob(value: Date) {
    this._dob = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get avatar(): string {
    return this._avatar;
  }

  public set avatar(value: string) {
    this._avatar = value;
  }

  public get role(): string {
    return this._role;
  }

  public set role(value: string) {
    this._role = value;
  }

  public get rating(): number {
    return this._rating;
  }

  public set rating(value: number) {
    this._rating = value;
  }

  public get noBooking(): number {
    return this._noBooking;
  }

  public set noBooking(value: number) {
    this._noBooking = value;
  }

  public get nationalId(): string {
    return this._nationalId;
  }

  public set nationalId(value: string) {
    this._nationalId = value;
  }

  public get address(): string {
    return this._address;
  }

  public set address(value: string) {
    this._address = value;
  }

  public get wardId(): number {
    return this._wardId;
  }

  public set wardId(value: number) {
    this._wardId = value;
  }

  public get driverLicense(): string {
    return this._driverLicenseImage;
  }

  public set driverLicense(value: string) {
    this._driverLicenseImage = value;
  }
}
