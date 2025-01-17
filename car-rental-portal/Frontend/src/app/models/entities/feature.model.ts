export class Feature {
    private _id: number;
    private _featureName: string;
    private _featureType: string;

    constructor(id?:number,featureName?:string,featureType?:string){
        this._id = id ?? -1;
        this._featureName = featureName ?? '';
        this._featureType = featureType ?? '';
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get featureName(): string {
        return this._featureName;
    }
    public set featureName(value: string) {
        this._featureName = value;
    }
    public get featureType(): string {
        return this._featureType;
    }
    public set featureType(value: string) {
        this._featureType = value;
    }
}