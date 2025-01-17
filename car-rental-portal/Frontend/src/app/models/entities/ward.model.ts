import { District } from "./district.model";

export class Ward {
    private _id: number;
    private _district: District;
    private _wardName: string;
    private _wardCode: string;

    constructor(id?:number, district?:District, wardName?: string, wardCode?:string){
        this._id = id ?? -1;
        this._district = district ?? new District();
        this._wardName = wardName ?? '';
        this._wardCode = wardCode ?? '';
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get district(): District {
        return this._district;
    }
    public set district(value: District) {
        this._district = value;
    }
    public get wardName(): string {
        return this._wardName;
    }
    public set wardName(value: string) {
        this._wardName = value;
    }
    public get wardCode(): string {
        return this._wardCode;
    }
    public set wardCode(value: string) {
        this._wardCode = value;
    }

}