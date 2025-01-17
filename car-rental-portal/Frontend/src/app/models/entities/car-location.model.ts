import { Ward } from './ward.model';

export class CarLocation {
  private _id: number;
  private _ward: Ward;
  private _road: string;
  private _lng: number;

  constructor(id?:number, ward?:Ward, road?:string, lng?:number) {
    this._id = id ?? -1;
    this._ward = ward ?? new Ward();
    this._road = road ?? '';
    this._lng = lng ?? -1;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get ward(): Ward {
    return this._ward;
  }
  public set ward(value: Ward) {
    this._ward = value;
  }
  public get road(): string {
    return this._road;
  }
  public set road(value: string) {
    this._road = value;
  }
  private _lat: number;
  public get lat(): number {
    return this._lat;
  }
  public set lat(value: number) {
    this._lat = value;
  }
  public get lng(): number {
    return this._lng;
  }
  public set lng(value: number) {
    this._lng = value;
  }
}
