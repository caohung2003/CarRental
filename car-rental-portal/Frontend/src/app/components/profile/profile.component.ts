import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/entities/user.model';
import { UserService } from '../../services/user.service';
import { Rating } from '../../models/interfaces/rating';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CarouselModule, Carousel } from "primeng/carousel";
import { CarBasic } from '../../models/interfaces/carbasic';
import { Location } from "../../models/interfaces/location";
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, CarouselModule, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {

  user: User;
  isRateRenter = true;

  customer_rating: Rating[] = [];
  owner_rating: Rating[] = [];
  show_rating: Rating[] = [];

  sizeRating: number = 5;

  numOfRateOwner: number = 0;
  numOfRateRenter: number = 0;

  pageOfRateCustomer: number = 0;
  pageOfRateOwner: number = 0;

  isMore: boolean = false;
  id: string = '';
  isLoading: boolean = true;
  isLoadingCar: boolean = true;

  cars: CarBasic[] = [];

  responsiveOptions: any[] | undefined;
  public numScroll = 1;
  public numVisible = 1;

  @ViewChild('carowner') carowner!: ElementRef;
  @ViewChild('carcustomer') carcustomer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.getBasicUser(this.id);
    this.getUserRating(this.id, this.pageOfRateCustomer, this.sizeRating);
    this.getOwnerRating(this.id, this.pageOfRateOwner, this.sizeRating);
    this.show_rating = this.customer_rating;
    this.getCarOwner(this.id);
    this.responsiveOptions = [
      {
        breakpoint: '1399px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1
      },
    ];
  }

  getBasicUser(id: any) {
    let load = true;
    this.isLoading = true;
    this.userService.gerUserInfo_basic(id).subscribe((response: any) => {
      this.user = new User();
      this.user.id = response.id,
        this.user.firstName = response.firstName,
        this.user.lastName = response.lastName,
        this.user.email = response.email,
        this.user.rating = response.rating,
        this.user.avatar = response.avatar,
        this.user.noBooking = response.noBooking

    }, error => {
      load = false;
    },
      () => {
        if (!load) {
          // this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      });
  }

  showOwnerRating() {
    this.carowner.nativeElement.classList.add('active');
    this.carcustomer.nativeElement.classList.remove('active');
    this.isRateRenter = false;
    this.show_rating = this.owner_rating;
    if (this.numOfRateOwner > this.sizeRating * (this.pageOfRateOwner + 1)) this.isMore = true;
    else this.isMore = false;
  }

  showCustomerRating() {
    this.carowner.nativeElement.classList.remove('active');
    this.carcustomer.nativeElement.classList.add('active');
    this.isRateRenter = true;
    this.show_rating = this.customer_rating;
    if (this.numOfRateRenter > this.sizeRating * (this.pageOfRateCustomer + 1)) this.isMore = true;
    else this.isMore = false;
  }

  getUserRating(id: any, page: any, size: any) {
    let load = true;
    this.isLoading = true;
    this.userService.getUserRating(id, size, page).subscribe((response: any) => {
      // console.log("response: ", response);
      this.numOfRateRenter = response.totalElements;
      if (this.numOfRateRenter > this.sizeRating * (this.pageOfRateCustomer + 1)) this.isMore = true;
      else this.isMore = false;
      for (const element of response.content) {
        let rate: Rating = {
          id: element.id,
          stars: element.stars,
          comment: element.comment,
          senderId: element.senderId,
          senderFirstName: element.senderFirstName,
          senderLastName: element.senderLastName,
          senderAvatar: element.senderAvatar,
          receiverId: element.receiverId,
          receiverFirstName: element.receiverFirstName,
          receiverLastName: element.receiverLastName,
          receiverAvatar: element.receiverAvatar,
          dateTime: element.dateTime,
          isRenterFeedback: element.isRenterFeedback
        };
        if (rate.isRenterFeedback === true) {
          this.customer_rating.push(rate);
        } else {
          this.owner_rating.push(rate);
        }
      }
    }, error => {
      load = false;
    },
      () => {
        if (!load) {
          // this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      });
  }

  getOwnerRating(id: any, page: any, size: any) {
    let load = true;
    this.isLoading = true;
    this.userService.getOwnerRating(id, size, page).subscribe((response: any) => {
      // console.log("response: ", response);
      this.numOfRateOwner = response.totalElements;
      if (this.numOfRateOwner > this.sizeRating * (this.pageOfRateOwner + 1)) this.isMore = true;
      else this.isMore = false;
      for (const element of response.content) {
        let rate: Rating = {
          id: element.id,
          stars: element.stars,
          comment: element.comment,
          senderId: element.senderId,
          senderFirstName: element.senderFirstName,
          senderLastName: element.senderLastName,
          senderAvatar: element.senderAvatar,
          receiverId: element.receiverId,
          receiverFirstName: element.receiverFirstName,
          receiverLastName: element.receiverLastName,
          receiverAvatar: element.receiverAvatar,
          dateTime: element.dateTime,
          isRenterFeedback: element.isRenterFeedback
        };
        if (rate.isRenterFeedback === true) {
          this.customer_rating.push(rate);
        } else {
          this.owner_rating.push(rate);
        }
      }
    }, error => {
      load = false;
    },
      () => {
        if (!load) {
          // this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      });
  }

  getMore() {
    if (this.isRateRenter) {
      this.pageOfRateCustomer++;
      this.getUserRating(this.id, this.pageOfRateCustomer, this.sizeRating);
    } else {
      this.pageOfRateOwner++;
      this.getOwnerRating(this.id, this.pageOfRateOwner, this.sizeRating);
    }
  }

  getCarOwner(id: any) {
    let load = true;
    this.isLoadingCar = true;
    this.userService.getCarOwner(id).subscribe((response: any) => {
      // console.log("response: ", response);
      for (const element of response) {
        let locations: Location[] = [];
        let road = element.road && element.road !== "undefined" ? element.road + ", " : "";
        let l: Location = {
          id: element.ward.id,
          code: '0',
          name: road
            + element.ward.wardName + ", "
            + element.ward.district.districtName + ", "
            + element.ward.district.city.cityName,
          // lat: 0,
          // lng: 0,
        }
        locations.push(l);
        let features: string[] = [];
        let terms: string[] = [];
        let one: CarBasic = {
          id: element.carId,
          front: element.frontImgUrl,
          back: element.backImgUrl,
          left: element.leftImgUrl,
          right: element.rightImgUrl,
          brand: element.brandName,
          model: element.modelName,
          rating: element.rating,
          rides: element.noRides,
          price: element.basePrice,
          transmission: element.transmission,
          seat: element.noSeat,
          mileage: element.mileage,
          consumption: element.fuelConsumption,
          description: "",
          deposit: 0,
          fuel: element.fuel,
          location: locations,
          features: features,
          lat: element.lat,
          lng: element.lng,
          distance: element.distance,
          terms: terms,
          insurance_status: true
        }
        this.cars.push(one);
      }
      // console.log('cars', this.cars);
    }, error => {
      load = false;
    },
      () => {
        if (!load) {
          // this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoadingCar = false;
        }
      });
  }

  roundStars(stars: number): number {
    return Math.round(stars);
  }

  getDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${day.length < 2 ? "0" + day : day}`;
  }

  getMonth(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${month.length < 2 ? "0" + month : month}`;
  }

  getYear(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${year}`;
  }

  min(n1: number, n2: number): number {
    return n1 > n2 ? n2 : n1;
  }
}
