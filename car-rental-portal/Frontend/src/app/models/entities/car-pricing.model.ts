export class CarPricing {
    private _id: number;
    private _basePrice: number;
    private _requiredDeposit: number;

    constructor(id?:number, basePrice?:number, requiredDeposit?:number){
        this._id = id ?? -1;
        this._basePrice = basePrice ?? -1;
        this._requiredDeposit = requiredDeposit ?? -1;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get basePrice(): number {
        return this._basePrice;
    }

    public set basePrice(value: number) {
        this._basePrice = value;
    }

    public get requiredDeposit(): number {
        return this._requiredDeposit;
    }

    public set requiredDeposit(value: number) {
        this._requiredDeposit = value;
    }
}