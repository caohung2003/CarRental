export class BookingBasicInfo {
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _nationalId: string;
  private _dob: Date;
  private _email: string;
  private _drivingLicense: FormData;
  private _city: string;
  private _district: string;
  private _ward: string;
  private _street: string;

  constructor(
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    nationalId?: string,
    dob?: Date,
    email?: string,
    drivingLicense?: FormData,
    city?: string,
    district?: string,
    ward?: string,
    street?: string
  ) {
    this._firstName = firstName ?? '';
    this._lastName = lastName ?? '';
    this._phoneNumber = phoneNumber ?? '';
    this._nationalId = nationalId ?? '';
    this._dob = dob ?? new Date();
    this._email = email ?? '';
    this._city = city ?? '0';
    this._district = district ?? '0';
    this._ward = ward ?? '0';
    this._street = street ?? '';
    if (drivingLicense)
      for (let [key, value] of drivingLicense.entries()) {
        this._drivingLicense.append(key, value);
      }
    else
      this._drivingLicense = new FormData();
  }

  public get phoneNumber(): string {
    return this._phoneNumber;
  }

  public set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  public get nationalId(): string {
    return this._nationalId;
  }

  public set nationalId(value: string) {
    this._nationalId = value;
  }

  public get dob(): Date {
    return this._dob;
  }

  public set dob(value: Date) {
    this._dob = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get drivingLicense(): FormData {
    return this._drivingLicense;
  }

  public set drivingLicense(value: FormData) {
    this._drivingLicense = value;
  }

  public get city(): string {
    return this._city;
  }

  public set city(value: string) {
    this._city = value;
  }

  public set province(value: string) {
    this._city = value;
  }

  public get district(): string {
    return this._district;
  }

  public set district(value: string) {
    this._district = value;
  }

  public get ward(): string {
    return this._ward;
  }

  public set ward(value: string) {
    this._ward = value;
  }

  public get street(): string {
    return this._street;
  }

  public set street(value: string) {
    this._street = value;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }
}
