export class Car {
    private _id: number;
    private _name: string;
    private _rating: number;
    private _ride: number;
    private _front: string;
    private _back: string;
    private _left: string;
    private _right: string;

    constructor(id?: number, name?: string, rating?: number, ride?: number, front?: string, back?: string, left?: string, right?: string) {
        this._id = id ?? 0;
        this._name = name ?? "";
        this._rating = rating ?? 0;
        this._ride = ride ?? 0;
        this._front = front ?? "";
        this._back = back ?? "";
        this._left = left ?? "";
        this._right = right ?? "";
    }

    public get id() {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get rating() {
        return this._rating;
    }

    public set rating(rating: number) {
        this._rating = rating;
    }

    public get ride() {
        return this._ride;
    }

    public set ride(ride: number) {
        this._ride = ride;
    }

    public get front() {
        return this._front;
    }

    public set front(front: string) {
        this._front = front;
    }

    public get back() {
        return this._back;
    }

    public set back(back: string) {
        this._back = back;
    }

    public get left() {
        return this._left;
    }

    public set left(left: string) {
        this._left = left;
    }

    public get right() {
        return this._right;
    }

    public set right(right: string) {
        this._right = right;
    }
}
