import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "../shared/http.service";
import { RatingSend } from "../models/interfaces/rating-send";
import { endpoints } from "../constants/end-points";

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private serverUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient, private httpService: HttpService,) {
  }

  public sendRate(feedback: RatingSend) {
    return this.httpService.postWithToken(endpoints.save_rate, feedback);
  }

  public getAllRatingsByBooking(bookingId: number) {
    return this.httpService.getNoTokenNew(endpoints.get_booking_rate + bookingId);
  }

  public getStarsReceivedAsCOByTime(start: string, end: string) {
    return this.httpService.getWithToken(endpoints.get_star_received_co_by_time + "?start=" + start + "&end=" + end);
  }

  public getStarsReceivedAsRenterByTime(start: string, end: string) {
    return this.httpService.getWithToken(endpoints.get_star_received_renter_by_time + "?start=" + start + "&end=" + end);
  }

  public getRatingsReceivedAsCarOwnerByTime(sort: string, order: string, start: string, end: string, page: number, star: number) {
    if (sort != "")
      return this.httpService.getWithToken(endpoints.get_rating_as_car_owner_by_time + "?sort=" + sort + "&order=" + order + "&start=" + start + "&end=" + end + "&page=" + page + "&size=5&star=" + star);
    else
      return this.httpService.getWithToken(endpoints.get_rating_as_car_owner_by_time + "?start=" + start + "&end=" + end + "&page=" + page + "&size=5&star=" + star);
  }

  public getRatingsReceivedAsRenterByTime(sort: string, order: string, start: string, end: string, page: number, star: number) {
    if (sort != "")
      return this.httpService.getWithToken(endpoints.get_rating_as_renter_by_time + "?sort=" + sort + "&order=" + order + "&start=" + start + "&end=" + end + "&page=" + page + "&size=5&star=" + star);
    else
      return this.httpService.getWithToken(endpoints.get_rating_as_renter_by_time + "?start=" + start + "&end=" + end + "&page=" + page +"&size=5&star=" + star);
  }

  public getAvgRating5MonthsReceivedAsCO() {
    return this.httpService.getWithToken(endpoints.get_avg_rate_received_co_fivemonths);
  }

  public getAvgRating5MonthsReceivedAsRenter() {
    return this.httpService.getWithToken(endpoints.get_avg_rate_received_renter_fivemonths);
  }
}
