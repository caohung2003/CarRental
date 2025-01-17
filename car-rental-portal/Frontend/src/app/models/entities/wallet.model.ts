import { Transaction } from './transaction.model';
import { User } from './user.model';

export class Wallet {
  private _id: number;
  private _user: User;
  private _balance: number;
  private _availableBalance: number;
  private _transactions: Transaction[];

  constructor(
    id?: number,
    user?: User,
    balance?: number,
    availableBalance?: number,
    transactions?: Transaction[]
  ) {
    this._id = id ?? -1;
    this._user = user ?? new User();
    this._balance = balance ?? -1;
    this._availableBalance = availableBalance ?? -1;
    this._transactions = transactions ?? [];
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
  }
  public get balance(): number {
    return this._balance;
  }
  public set balance(value: number) {
    this._balance = value;
  }
  public get availableBalance(): number {
    return this._availableBalance;
  }
  public set availableBalance(value: number) {
    this._availableBalance = value;
  }
  public get transactions(): Transaction[] {
    return this._transactions;
  }
  public set transactions(value: Transaction[]) {
    this._transactions = value;
  }
}
