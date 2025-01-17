export interface RatingSend {
  id?: number,
  booking: Booking,
  stars: number,
  comment: string,
  dateTime: Date,
  isRenterFeedback: boolean,
  isFixed?: boolean
}
export interface Booking{
  id: number
}
