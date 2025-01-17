import { City } from "./city.model";

export class District{
    private _id: number;
    private _city: City;
    private _districtName: string;
    private _districtCode: string;

    constructor(id?:number, city?:City, districtName?:string, districtCode?:string){
        this._id = id ?? -1;
        this._city = city ?? new City();
        this._districtName = districtName ?? '';
        this.districtCode = districtCode ?? '';
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get city(): City {
        return this._city;
    }

    public set city(value: City) {
        this._city = value;
    }

    public get districtName(): string {
        return this._districtName;
    }

    public set districtName(value: string) {
        this._districtName = value;
    }

    public get districtCode(): string {
        return this._districtCode;
    }
    
    public set districtCode(value: string) {
        this._districtCode = value;
    }
}