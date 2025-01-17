import { Brand } from "./brand.model";

export class BrandModel{
    private _id:number;
    private _brand:Brand;
    private _modelName:string;

    constructor(id?: number, brand?: Brand, modelName?: string) {
        this._id = id ?? -1;
        this._brand = brand ?? new Brand();
        this._modelName = modelName ?? '';
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get brand(): Brand {
        return this._brand;
    }

    set brand(brand: Brand) {
        this._brand = brand;
    }

    get modelName(): string {
        return this._modelName;
    }

    set modelName(modelName: string) {
        this._modelName = modelName;
    }
}