export class Brand{
    private _id: number;
    private _name: string;

    constructor(id?: number, name?: string) {
        this._id = id ?? -1;
        this._name = name ?? '';
    }

    get id(): number {
        return this._id;
    }
    set id(id: number) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }
}