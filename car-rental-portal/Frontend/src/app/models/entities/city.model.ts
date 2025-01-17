export class City {
    private _id: number;
    private _cityCode: string;
    private _cityName:string;

    constructor(id?:number, cityCode?:string, cityName?:string){
        this._id = id ?? -1;
        this._cityCode = cityCode ?? '';
        this._cityName = cityName ?? '';
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get cityName(): string {
        return this._cityName;
    }

    public set cityName(value: string) {
        this._cityName = value;
    }

    public get cityCode(): string {
        return this._cityCode;
    }

    public set cityCode(value: string) {
        this._cityCode = value;
    }
}