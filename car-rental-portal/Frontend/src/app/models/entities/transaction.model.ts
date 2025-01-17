export enum TransactionType {
  TOP_UP,
  WITHDRAWAL,
  DEBIT,
  CREDIT,
}

export enum TransactionStatus {
  PENDING,
  COMPLETED,
  CANCELED,
}

export class Transaction {
  private _id: number;
  private _transactionId: number;
  private _bookingId:number;
  private _amount: number;
  private _message: string;
  private _timeStamp: Date;
  private _type: TransactionType;
  private _status: TransactionStatus;

  constructor(
    id?: number,
    transactionId?: number,
    bookingId?: number,
    amount?: number,
    message?: string,
    timeStamp?: Date,
    type?: TransactionType,
    status?: TransactionStatus
  ) {
    this._id = id ?? -1;
    this._transactionId = transactionId ?? -1;
    this._bookingId = bookingId ?? -1;
    this._amount = amount ?? -1;
    this._message = message ?? '';
    this._timeStamp = timeStamp ?? new Date();
    this._type = type ?? TransactionType.WITHDRAWAL;
    this._status = status ?? TransactionStatus.CANCELED;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get transactionId(): number {
    return this._transactionId;
  }
  public set transactionId(value: number) {
    this._transactionId = value;
  }
  public get bookingId(): number {
    return this._bookingId;
  }
  public set bookingId(value: number) {
    this._bookingId = value;
  }
  public get amount(): number {
    return this._amount;
  }
  public set amount(value: number) {
    this._amount = value;
  }
  public get message(): string {
    return this._message;
  }
  public set message(value: string) {
    this._message = value;
  }
  public get timeStamp(): Date {
    return this._timeStamp;
  }
  public set timeStamp(value: Date) {
    this._timeStamp = value;
  }
  public get type(): TransactionType {
    return this._type;
  }
  public set type(value: TransactionType) {
    this._type = value;
  }
  public get status(): TransactionStatus {
    return this._status;
  }
  public set status(value: TransactionStatus) {
    this._status = value;
  }
}
