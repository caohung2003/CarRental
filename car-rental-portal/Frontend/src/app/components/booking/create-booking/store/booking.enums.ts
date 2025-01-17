export enum bookingStatus {
    cancelled = 0,
    waitingRenterConfirmation = 1,
    pendingDeposit = 2,
    pendingPickup = 3,
    inUsed = 4,
    pendingPayment = 5,
    completed = 6
}