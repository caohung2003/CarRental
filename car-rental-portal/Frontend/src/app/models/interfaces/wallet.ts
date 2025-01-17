import { User } from "../entities/user.model";
import { Transaction } from "./transaction";

export interface Wallet{
    id: number,
    user: User,
    pendingBalance: number,
    availableBalance: number
}