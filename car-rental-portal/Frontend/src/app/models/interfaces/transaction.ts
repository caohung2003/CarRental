export interface Transaction{
    id: number,
    transactionId:number,
    bookingId:number,
    amount: number,
    message: string,
    date: string,
    type: string,
    status: string,
    userId?: string
}
