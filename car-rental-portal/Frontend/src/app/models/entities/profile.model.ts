export class Profile {
    private _ownerId: number;
    private _firstName: string;
    private _lastName: string;
    private _avatar: string;
    private _rating: number;
    private _noBooking: number;
    private _phone: string;
    
    constructor(ownerId?:number, firstName?:string, lastName?:string, avatar?:string, rating?:number, noBooking?:number, phone?:string){
        this._ownerId =  ownerId ?? -1;
        this._firstName = firstName ?? '';
        this._lastName = lastName ?? '';
        this._phone = phone ?? '';
        this._avatar = avatar ?? '';
    }

    public get ownerId(): number {
        return this._ownerId;
    }
    public set ownerId(value: number) {
        this._ownerId = value;
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
    public get avatar(): string {
        return this._avatar;
    }
    public set avatar(value: string) {
        this._avatar = value;
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
    public get phone(): string {
        return this._phone;
    }
    public set phone(value: string) {
        this._phone = value;
    }
}