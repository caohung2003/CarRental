import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { } from '@coreui/angular';

import { NgForOf, NgIf } from '@angular/common';
import { ChartjsComponent } from "@coreui/angular-chartjs";
import { DateRangeComponent } from "../../shared/components/date-range/date-range.component";
import { FeedbackItemComponent } from "./feedback-item/feedback-item.component";
import { RatingService } from '../../services/rating.service';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../models/interfaces/rating';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../services/errors.service';

export interface StarDetail {
  star: number,
  total: number,
  percent: string
}

export interface AvgRatePerMonth {
  month: string,
  avgRate: number
}

@Component({
  selector: 'app-feedback-report',
  standalone: true,
  templateUrl: './feedback-report.component.html',
  styleUrl: './feedback-report.component.css',
  imports: [FooterComponent, RouterLink, HeaderComponent, NgIf, ChartjsComponent, DateRangeComponent, FeedbackItemComponent, FormsModule, NgForOf]
})


export default class FeedbackReportComponent implements OnInit {

  activeTab: string = 'Car Owner';

  public page: number = 0;

  public totalPages: number = 3;

  public totalElements: number = 5;

  public arrPage: number[] = [1, 2, 3];

  public start: string = this.getDateBeforeFormatted();

  public end: string = this.getDateFormatted();


  constructor(private ratingService: RatingService, private authService: AuthService, private route: Router, private errorService: ErrorsService) {
    this.url = this.route.url;
  }

  public data: any;

  public months: string[] = [];
  public avgPerMonths: number[] = [];

  getAvgRating5MonthsReceivedAsCO() {
    this.ratingService.getAvgRating5MonthsReceivedAsCO().subscribe(
      (response: any) => {
        this.months = [];
        this.avgPerMonths = [];
        for (let i = 0; i < response.length; i++) {
          var month: string = "";
          switch (response[i][0]) {
            case 1: {
              month = "January";
              break;
            }
            case 2: {
              month = "February";
              break;
            }
            case 3: {
              month = "March";
              break;
            }
            case 4: {
              month = "April";
              break;
            }
            case 5: {
              month = "May";
              break;
            }
            case 6: {
              month = "June";
              break;
            }
            case 7: {
              month = "July";
              break;
            }
            case 8: {
              month = "August";
              break;
            }
            case 9: {
              month = "September";
              break;
            }
            case 10: {
              month = "October";
              break;
            }
            case 11: {
              month = "November";
              break;
            }
            case 12: {
              month = "December";
              break;
            }
          }
          this.months.push(month);
          this.avgPerMonths.push(response[i][1]);
        }
        this.data = {
          labels: this.months,
          datasets: [
            {
              label: 'Average Rate',
              backgroundColor: 'rgb(255, 198, 52)',
              borderColor: 'rgb(255, 198, 52)',
              pointBackgroundColor: 'rgb(255, 198, 52)',
              pointBorderColor: 'rgb(255, 198, 52)',
              data: this.avgPerMonths
            }
          ]
        };
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    )
  }

  getAvgRating5MonthsReceivedAsRenter() {
    this.ratingService.getAvgRating5MonthsReceivedAsRenter().subscribe(
      (response: any) => {
        this.months = [];
        this.avgPerMonths = [];
        for (let i = 0; i < response.length; i++) {
          var month: string = "";
          switch (response[i][0]) {
            case 1: {
              month = "January";
              break;
            }
            case 2: {
              month = "February";
              break;
            }
            case 3: {
              month = "March";
              break;
            }
            case 4: {
              month = "April";
              break;
            }
            case 5: {
              month = "May";
              break;
            }
            case 6: {
              month = "June";
              break;
            }
            case 7: {
              month = "July";
              break;
            }
            case 8: {
              month = "August";
              break;
            }
            case 9: {
              month = "September";
              break;
            }
            case 10: {
              month = "October";
              break;
            }
            case 11: {
              month = "November";
              break;
            }
            case 12: {
              month = "December";
              break;
            }
          }
          this.months.push(month);
          this.avgPerMonths.push(response[i][1]);
        }
        this.data = {
          labels: this.months,
          datasets: [
            {
              label: 'Average Rate',
              backgroundColor: 'rgb(255, 198, 52)',
              borderColor: 'rgb(255, 198, 52)',
              pointBackgroundColor: 'rgb(255, 198, 52)',
              pointBorderColor: 'rgb(255, 198, 52)',
              data: this.avgPerMonths
            }
          ]
        };
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    )
  }

  ngOnInit() {
    this.getAvgRating5MonthsReceivedAsCO();

    this.getStarsReceivedAsCOByTime();
    this.getRating();
  }


  handleChartRef($chartRef: any) {
    if ($chartRef) {
      setTimeout(() => {
        $chartRef?.update();
      }, 3000);
    }
  }

  public totalRatings: number = 0;

  public goodRatingsPercent: number = 0;

  public totalAndPercent: StarDetail[] = [];

  public ratings: Rating[] = [];

  public isLoadAllRate: boolean = false


  getDateFormatted(): string {
    var date = new Date();
    return date.getFullYear() + '-' +
      (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
      (date.getDate() + 1 < 10 ? ("0" + (date.getDate() + 1)) : (date.getDate() + 1)) + "T00:00";
  }

  getDateBeforeFormatted(): string {
    var date = new Date(new Date().getTime() - 13140000000);
    return date.getFullYear() + '-' +
      (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
      (date.getDate() + 1 < 10 ? ("0" + (date.getDate() + 1)) : (date.getDate() + 1)) + "T00:00";
  }

  public url: string;

  logout() {
    this.authService.logout(true);
  }

  public getRating() {
    if (this.activeTab == 'Car Owner') {
      this.ratingService.getRatingsReceivedAsCarOwnerByTime(this.sort, this.order, this.start, this.end, this.page, this.filterStars).subscribe(
        (response: any) => {
          console.log(response);
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.ratings = [];
          this.arrPage = [];
          for (let index = 0; index < response.totalPages; index++) {
            this.arrPage.push(index + 1);

          }
          for (let i = 0; i < response.content.length; i++) {
            var rating: Rating = {
              id: response.content[i].id,
              stars: response.content[i].stars,
              comment: response.content[i].comment,
              senderId: response.content[i].senderId,
              senderFirstName: response.content[i].senderFirstName,
              senderLastName: response.content[i].senderLastName,
              senderAvatar: response.content[i].senderAvatar,
              receiverId: response.content[i].receiverId,
              receiverFirstName: response.content[i].receiverFirstName,
              receiverLastName: response.content[i].receiverLastName,
              receiverAvatar: response.content[i].receiverAvatar,
              dateTime: response.content[i].dateTime,
              isRenterFeedback: response.content[i].isRenterFeedback,
              canFixed: response.content[i].canFixed,
              bookingId: response.content[i].bookingId
            }
            this.ratings.push(rating);
          }
          this.isLoadAllRate = true;
        },
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authService.logout(true, 'Phien dang nhap het han');
          } else if (error.status == 403) {
            this.route.navigate(['/403']);
          } else {
            this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
          }
        }
      )
    }
    else {
      this.ratingService.getRatingsReceivedAsRenterByTime(this.sort, this.order, this.start, this.end, this.page, this.filterStars).subscribe(
        (response: any) => {
          console.log(response);
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.ratings = [];
          this.arrPage = [];
          for (let index = 0; index < response.totalPages; index++) {
            this.arrPage.push(index + 1);

          }
          for (let i = 0; i < response.content.length; i++) {
            var rating: Rating = {

              id: response.content[i].id,
              stars: response.content[i].stars,
              comment: response.content[i].comment,
              senderId: response.content[i].senderId,
              senderFirstName: response.content[i].senderFirstName,
              senderLastName: response.content[i].senderLastName,
              senderAvatar: response.content[i].senderAvatar,
              receiverId: response.content[i].receiverId,
              receiverFirstName: response.content[i].receiverFirstName,
              receiverLastName: response.content[i].receiverLastName,
              receiverAvatar: response.content[i].receiverAvatar,
              dateTime: response.content[i].dateTime,
              isRenterFeedback: response.content[i].isRenterFeedback,
              canFixed: response.content[i].canFixed,
              bookingId: response.content[i].bookingId
            }
            this.ratings.push(rating);
          }
          this.isLoadAllRate = true;

        },
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authService.logout(true, 'Phien dang nhap het han');
          } else if (error.status == 403) {
            this.route.navigate(['/403']);
          } else {
            this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
          }
        }
      )
    }
  }

  getStarsReceivedAsRenterByTime() {

    this.ratingService.getStarsReceivedAsRenterByTime(this.start, this.end).subscribe(
      (response: any) => {
        console.log(response);
        this.totalAndPercent = [];
        var a = 0;
        // var labels: string[] = [];
        // var totals: number[] = [];
        this.totalRatings = 0;
        this.avgRate = 0;
        this.goodRatingsPercent = 0;
        for (let i = 0; i < response.length; i++) {
          this.totalRatings += response[i][1];
          this.avgRate += (response[i][0] * response[i][1]);
          if (response[i][0] >= 4) {
            a += response[i][1];
          }
          var starDetail: StarDetail = {
            star: response[i][0],
            total: response[i][1],
            percent: "0"
          }
          // totals.push(starDetail.total);
          this.totalAndPercent.push(starDetail);
          this.goodRatingsPercent = (a / this.totalRatings) * 100;
        }
        for (var i = 0; i < this.totalAndPercent.length; i++) {
          this.totalAndPercent[i].percent = ((this.totalAndPercent[i].total / this.totalRatings) * 100).toFixed(1);
          //  labels.push(this.totalAndPercent[i].star + " stars (" + this.totalAndPercent[i].total + " ratings - " + this.totalAndPercent[i].percent + "%)");
        }
    

        if (this.avgRate != 0)
          this.avgRate = Number(((this.avgRate / this.totalRatings)).toFixed(1));
        else
          this.avgRate = 0;

        for (let i = 1; i <= 5; i++) {
          var b = document.getElementById("star" + i);
          if (b != null) {
            if (i <= this.avgRate) {
              b.style.fill = "rgb(255, 198, 52)";
            }
            else {
              b.style.fill = "gray"
            }
          }
        }
        this.getPercentOfEachStar(this.totalAndPercent);
        this.isLoading = true;
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    )
  }

  isLoading: boolean = false;

  percent5Stars: number = 0;
  percent4Stars: number = 0;
  percent3Stars: number = 0;
  percent2Stars: number = 0;
  percent1Stars: number = 0;

  getPercentOfEachStar(totalAndPercent: StarDetail[]) {
    this.percent5Stars = 0;
    this.percent4Stars = 0;
    this.percent3Stars = 0;
    this.percent2Stars = 0;
    this.percent1Stars = 0;
    for (let i = 0; i < totalAndPercent.length; i++) {
      if (totalAndPercent[i].star == 5) {
        this.percent5Stars = Number(totalAndPercent[i].percent);
      }
      else if (totalAndPercent[i].star == 4) {
        this.percent4Stars = Number(totalAndPercent[i].percent);
      }
      else if (totalAndPercent[i].star == 3) {
        this.percent3Stars = Number(totalAndPercent[i].percent);
      }
      else if (totalAndPercent[i].star == 2) {
        this.percent2Stars = Number(totalAndPercent[i].percent);
      }
      else if (totalAndPercent[i].star == 1) {
        this.percent1Stars = Number(totalAndPercent[i].percent);
      }
    }


  }

  getStarsReceivedAsCOByTime() {
    this.ratingService.getStarsReceivedAsCOByTime(this.start, this.end).subscribe(
      (response: any) => {
        console.log(response);
        this.totalAndPercent = [];
        var a = 0;
        // var labels: string[] = [];
        // var totals: number[] = [];
        this.totalRatings = 0;
        this.avgRate = 0;
        this.goodRatingsPercent = 0;
        for (let i = 0; i < response.length; i++) {
          this.totalRatings += response[i][1];
          this.avgRate += (response[i][0] * response[i][1]);
          if (response[i][0] >= 4) {
            a += response[i][1];
          }
          var starDetail: StarDetail = {
            star: response[i][0],
            total: response[i][1],
            percent: "0"
          }
          //  totals.push(starDetail.total);
          this.totalAndPercent.push(starDetail);
          this.goodRatingsPercent = (a / this.totalRatings) * 100;
        }
        for (var i = 0; i < this.totalAndPercent.length; i++) {
          this.totalAndPercent[i].percent = ((this.totalAndPercent[i].total / this.totalRatings) * 100).toFixed(1);
          //  labels.push(this.totalAndPercent[i].star + " stars (" + this.totalAndPercent[i].total + " ratings - " + this.totalAndPercent[i].percent + "%)");
        }
        // this.data = {
        //   labels: labels,
        //   datasets: [{
        //     backgroundColor: ['#FFDE59', '#FE7A00', '#4ADC0F', '#89EAEE', '#CECECE'],
        //     data: totals
        //   }]
        // };
        if (this.avgRate != 0)
          this.avgRate = Number(((this.avgRate / this.totalRatings)).toFixed(1));
        else
          this.avgRate = 0;
        for (let i = 1; i <= 5; i++) {
          var b = document.getElementById("star" + i);
          if (b != null) {
            if (i <= this.avgRate) {
              b.style.fill = "rgb(255, 198, 52)";
            }
            else {
              b.style.fill = "gray"
            }
          }
        }
        this.getPercentOfEachStar(this.totalAndPercent);
        this.isLoading = true;
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.logout(true, 'Phien dang nhap het han');
        } else if (error.status == 403) {
          this.route.navigate(['/403']);
        } else {
          this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
        }
      }
    )

  }

  public filterStars: number = 0;

  filter(star: string) {
    this.page = 0;
    if (star != "ALL")
      this.filterStars = Number(star);
    else
      this.filterStars = 0;
    if (this.activeTab == 'Car Owner')
      this.getStarsReceivedAsCOByTime();
    else
      this.getStarsReceivedAsRenterByTime();
    this.getRating();
  }

  public sort: string = "";
  public order: string = "";

  srt(column: string) {
    if (column == "stars") {
      if ((this.sort == "" && this.order == "") || (this.sort == "dateTime")) {
        this.sort = "stars";
        this.order = "asc";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (b != null)
          b.src = "";
      } else if (this.sort == "stars" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "stars" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var c = document.getElementById("actionsDropdown");
      if (c != null) {
        c.classList.add("tw-hidden");
      }
      this.getRating();

      // this.getMyCars('no');
    } else if (column == "dateTime") {
      if ((this.sort == "" && this.order == "") || (this.sort == "stars")) {
        this.sort = "dateTime";
        this.order = "asc";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-ascending.png";
        var b = (document.getElementById("sortratingimg") as HTMLImageElement);
        if (b != null)
          b.src = "";
      } else if (this.sort == "dateTime" && this.order == "asc") {
        this.order = "desc";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "assets/images/icon/sort/sort-descending.png";
      } else if (this.sort == "dateTime" && this.order == "desc") {
        this.order = "";
        this.sort = "";
        var a = (document.getElementById("sortridesimg") as HTMLImageElement);
        if (a != null)
          a.src = "";
      }
      var c = document.getElementById("actionsDropdown");
      if (c != null) {
        c.classList.add("tw-hidden");
      }
      // this.getMyCars('no');
      this.getRating();
    }
  }

  convertDate(date: string): string {
    var s = date.split('/');
    return s[2] + '-' + s[1] + '-' + s[0];
  }

  getSavedDate(s: string[], index: number): string {
    var display: string = "";
    var dte: string[] = s[index].split('T');
    for (let j = 0; j < dte.length; j++) {
      if (j == 0) {
        display += (this.convertDate(dte[j]));
      } else {
        var minute = Number(dte[j]);
        display += "T";
        if (minute == 0) {
          display += "00:00";
        } else {
          display += (Math.floor(minute / 60) < 10 ? ("0" + Math.floor(minute / 60)) : (Math.floor(minute / 60)));
          display += ":";
          if (minute % 60 == 0) {
            display += "00";
          } else {
            display += "30";
          }
        }
      }

    }
    return display;
  }

  getDisplayString(s: string[], index: number): string {
    var display: string = "";
    var dte: string[] = s[index].split('T');
    for (let j = 0; j < dte.length; j++) {
      if (j == 0) {
        display += (dte[j] + " ");
      } else {
        var minute = Number(dte[j]);
        if (minute == 0) {
          display += "00:00";
        } else {
          display += (Math.floor(minute / 60) < 10 ? ("0" + Math.floor(minute / 60)) : (Math.floor(minute / 60)));
          display += ":";
          if (minute % 60 == 0) {
            display += "00";
          } else {
            display += "30";
          }
        }
      }

    }
    return display;
  }

  receiveDate(date: string) {
    var display: string = "";
    var start: string = "";
    var end: string = "";
    var s: string[] = date.split(' to ');
    for (let i = 0; i < s.length; i++) {
      if (i == 0) {
        display += this.getDisplayString(s, 0);
        display += " to ";
        start = this.getSavedDate(s, 0);
      } else {
        display += this.getDisplayString(s, 1);
        end = this.getSavedDate(s, 1);
      }
    }
    this.start = start;
    this.end = end;
    this.getRating();
    if (this.activeTab == 'Car Owner')
      this.getStarsReceivedAsCOByTime();
    else
      this.getStarsReceivedAsRenterByTime();
  }

  avgRate: number;

  createArray(n: number): number[] {
    let arr: number[] = [];
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
    return arr;
  }

  switchPage(p: number) {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getRating();
  }

  changeActiveTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab == 'Car Owner') {
      this.getStarsReceivedAsCOByTime();
      this.page = 0;
      this.getAvgRating5MonthsReceivedAsCO();
    }
    else {
      this.getStarsReceivedAsRenterByTime();
      this.page = 0;
      this.getAvgRating5MonthsReceivedAsRenter();
    }
    this.getRating();
  }

  getDateNowFormatted(dte?: string): string {
    var date: Date;

    if (dte != null) {
      date = new Date(dte);
    }
    else {
      date = new Date();
    }
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getUTCFullYear();
    //  return date;
  }

  getDateBefore5MonthsFormatted(dte?: string): string {
    var date: Date;
    if (dte != null) {
      date = new Date(new Date(dte).getTime() - 13140000000);
    }
    else {
      date = new Date(new Date().getTime() - 13140000000);
    }
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getUTCFullYear();
    // return date;
  }

}
