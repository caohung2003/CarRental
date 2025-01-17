export class CarBusyCalendar {
  private _id: number;
  private _start: Date;
  private _end: Date;

  constructor(id?: number, start?: Date, end?: Date) {
    this._id = id ?? -1;
    this._start = start ?? new Date();
    this._end = end ?? new Date();
}


  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get start(): Date {
    return this._start;
  }

  public set start(value: Date) {
    this._start = value;
  }

  public get end(): Date {
    return this._end;
  }

  public set end(value: Date) {
    this._end = value;
  }
}
