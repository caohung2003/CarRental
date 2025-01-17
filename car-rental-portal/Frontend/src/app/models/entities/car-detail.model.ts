export class CarDetails{
    private _id: number;
    private _mileage: number;
    private _fuelConsumption: number;
    private _description: string;
    private _frontImgUrl: string;
    private _backImgUrl: string;
    private _leftImgUrl: string;
    private _rightImgUrl: string;

    constructor(
        id?: number,
        mileage?: number,
        fuelConsumption?: number,
        description?: string,
        frontImgUrl?: string,
        backImgUrl?: string,
        leftImgUrl?: string,
        rightImgUrl?: string
    ) {
        this._id = id ?? -1;
        this._mileage = mileage ?? -1;
        this._fuelConsumption = fuelConsumption ?? -1;
        this._description = description ?? '';
        this._frontImgUrl = frontImgUrl ?? '';
        this._backImgUrl = backImgUrl ?? '';
        this._leftImgUrl = leftImgUrl ?? '';
        this._rightImgUrl = rightImgUrl ?? '';
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get mileage(): number {
        return this._mileage;
    }

    set mileage(value: number) {
        this._mileage = value;
    }

    get fuelConsumption(): number {
        return this._fuelConsumption;
    }

    set fuelConsumption(value: number) {
        this._fuelConsumption = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get frontImgUrl(): string {
        return this._frontImgUrl;
    }

    set frontImgUrl(value: string) {
        this._frontImgUrl = value;
    }

    get backImgUrl(): string {
        return this._backImgUrl;
    }

    set backImgUrl(value: string) {
        this._backImgUrl = value;
    }

    get leftImgUrl(): string {
        return this._leftImgUrl;
    }

    set leftImgUrl(value: string) {
        this._leftImgUrl = value;
    }

    get rightImgUrl(): string {
        return this._rightImgUrl;
    }

    set rightImgUrl(value: string) {
        this._rightImgUrl = value;
    }
}