import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CarBasic } from './../../models/interfaces/carbasic';
import { Location } from './../../models/interfaces/location';
import { User } from './../../models/entities/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { CommonModule, formatDate } from '@angular/common';
import { Rating } from '../../models/interfaces/rating';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { BookingService } from "../../services/booking.service";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent
  ],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css',
})

export class CarDetailComponent implements OnInit {
  isLoading: boolean = true;
  isLoadingRelated: boolean = true;
  public car: CarBasic;
  public user: User;
  public relateCars: CarBasic[] = [];
  public rates: Rating[] = [];
  public carRateAvg: number = 0;
  public totalMoney: number = 0;

  public totalRate: number = 0;
  public sizePage: number = 1;
  moreRate: boolean = false;
  private curPage: number = 0;
  private idCar: number = 0;

  filtersLoaded: Promise<boolean>;
  @ViewChild('img') modalImg!: ElementRef;
  @ViewChild('dragItem') parent!: ElementRef;
  @ViewChild('startDate') startDate!: ElementRef;
  @ViewChild('endDate') endDate!: ElementRef;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('header_hide') header_hide!: ElementRef;


  private isDown = false;
  private startX: number;
  private scrollLeft: number;

  todayDate: string;
  dateRangeForm: FormGroup;
  errorDate: boolean = false;
  errorBusy: boolean = false;
  errorAlreadyBooking: boolean = false;
  messageBusy: string = '';
  messageAlreadyBooking: string = '';
  message: boolean = false;
  countDate: string = '…';
  start: string = '…';
  end: string = '…';
  showStart: string = '';
  showEnd: string = '';
  disable = false;

  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.startX = event.pageX - this.parent.nativeElement.offsetLeft;
    this.scrollLeft = this.parent.nativeElement.scrollLeft;
  }

  checkAlreadyBooking(start: string, end: string) {
    this.bookingService.getOverlapBookingPending(start, end).subscribe(
      (response: any) => {
        if (response != null) {
          this.messageAlreadyBooking = 'You have already booked this car on this time';
          this.errorAlreadyBooking = true;
        }
        else {
          this.errorAlreadyBooking = false;
        }
      }
    )
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();

    const x = event.pageX - this.parent.nativeElement.offsetLeft;
    const walkX = (x - this.startX) * 1;
    this.parent.nativeElement.scrollLeft = this.scrollLeft - walkX;
  }

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private renderer: Renderer2,
    private bookingService: BookingService,
    private userService: UserService,
  ) {
    this.todayDate = this.getCurrentDate();
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      if (params['pick'] == null || params['drop'] == null) {
        this.dateRangeForm = new FormGroup({
          startDate: new FormControl(this.getCurrentDate(), Validators.required),
          endDate: new FormControl(this.getDateAfterDays(2), Validators.required)
        });
        this.start = this.showStart = this.getCurrentDate();
        this.end = this.showEnd = this.getDateAfterDays(2);
        this.countDate = '2';

      } else {
        this.dateRangeForm = new FormGroup({
          startDate: new FormControl(params['pick'], Validators.required),
          endDate: new FormControl(params['drop'], Validators.required)
        });
        this.start = this.showStart = params['pick'];
        this.end = this.showEnd = params['drop'];
        this.countDate = (new Date(params['drop']).getDate() - new Date(params['pick']).getDate()).toString();
        setTimeout(() => {
          this.count();
        })
      }
    });
    this.checkAlreadyBooking(this.dateRangeForm.value.startDate, this.dateRangeForm.value.endDate);
    this.checkDate();
    let id = this.route.snapshot.paramMap.get('id');
    if (!this.isPositiveInteger(id)) this.router.navigate(['/404'], { skipLocationChange: true });
    if (id != null) {
      this.idCar = Number(id);
      await this.getCar(id);
    }
    this.checkBusy();
    setTimeout(() => {
      this.count();
    })
  }

  isPositiveInteger(id: string | null): boolean {
    return !!id && /^\d+$/.test(id) && parseInt(id, 10) > 0;
  }

  private curUser = new User();
  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userService.getUserInfoX().subscribe(
        (response: any) => {
          this.curUser.id = response.id;
          this.curUser.firstName = response.firstName;
          this.curUser.lastName = response.lastName;
          this.curUser.email = response.email;
          this.curUser.avatar = response.avatar;
          resolve(this.curUser);
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  }

  @HostListener('document:wheel', ['$event.target'])
  onScroll() {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos <= 50) {
      this.header_hide.nativeElement.classList.remove('tw-hidden');
    } else {
      this.header_hide.nativeElement.classList.add('tw-hidden'); // adjust this value to the height of your header
    }
  }

  getCurrentDate(): string {
    return formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en-US');
  }

  getDateAfterDays(days: number): string {
    const currentDate = new Date();
    const daysLater = new Date(currentDate);
    daysLater.setDate(currentDate.getDate() + days);
    return formatDate(daysLater, 'yyyy-MM-ddTHH:mm', 'en-US');
  }

  changePickDate() {
    if (this.endDate && this.startDate) {
      if (this.dateRangeForm.value.startDate == null || this.dateRangeForm.value.startDate == "") {
        this.message = true;
        this.endDate.nativeElement.disabled = true;
        this.start = '…'
      } else {
        this.message = false;
        this.endDate.nativeElement.disabled = false;
        this.start = this.dateRangeForm.value.startDate;
      }
    }
    this.checkDate();
    this.count();
  }

  changeDropDate() {
    if (this.endDate && this.startDate) {
      if (this.dateRangeForm.value.endDate == null || this.dateRangeForm.value.endDate == "") {
        this.end = '…'
      } else {
        this.end = this.dateRangeForm.value.endDate;
      }
    }
    this.checkDate();
    this.count();
  }

  count() {
    if (this.dateRangeForm.value.startDate != null && this.dateRangeForm.value.endDate != null) {
      this.countDate = this.countDays(this.dateRangeForm.value.startDate, this.dateRangeForm.value.endDate);
    } else {
      this.countDate = '…';
    }
    if (this.countDate != '…') {
      this.totalMoney = this.car.price * (+this.countDate);
    }
  }

  checkDate() {
    if (this.dateRangeForm.value.endDate == null || this.dateRangeForm.value.endDate == ""
      || this.dateRangeForm.value.startDate == null || this.dateRangeForm.value.startDate == "") {
      return false;
    }
    if (this.compareDates(this.dateRangeForm.value.startDate, this.dateRangeForm.value.endDate) == -1) {
      this.errorDate = false;
      return true;
    } else {
      this.errorDate = true;
      return false;
    }
  }

  checkBusy() {
    this.carService.checkBusyTime(this.idCar, this.dateRangeForm.value.startDate, this.dateRangeForm.value.endDate).subscribe((response: any) => {
      if (response != null && response.length > 0) {
        this.errorBusy = true;
        this.messageBusy = 'This vehicle is busy/busy during the period from ' + this.convertDateFormat(response[0].start) + ' to ' + this.convertDateFormat(response[0].end);
      } else {
        this.errorBusy = false;
      }
    }, error => {
      this.errorBusy = false;
      this.messageBusy = 'Invalid Date';
    });
  }

  onSubmit() {
    if (this.dateRangeForm.valid && this.checkDate()) {
      this.showStart = this.start;
      this.showEnd = this.end;
      this.checkBusy();
      this.closeModal.nativeElement.click();
    }
  }

  private roads = [
    {
      id: 0,
      value: ''
    }
  ];
  getCar(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let load = true;
      this.isLoading = true;
      this.carService.getCarDetail(id).subscribe(
        (response: any) => {
          if (response.status == 'WAIT_FOR_APPROVAL' || response.status == 'STOPPED') {
            load = false;
            this.router.navigate(['/404'], { skipLocationChange: true });
          }
          let locations: Location[] = [];
          this.roads = [];
          for (const element of response.carLocations) {
            let road = element.road != null ? element.road + ", " : "";
            let l: Location = {
              id: element.id,
              code: element.ward.district.city.cityCode + " " + element.ward.district.districtCode + " " + element.ward.id,
              name: road
                + element.ward.wardName + ", "
                + element.ward.district.districtName + ", "
                + element.ward.district.city.cityName,
              // lat: element.lat,
              // lng: element.lng,
            }
            this.roads.push(
              {
                id: element.id,
                value: element.road != null ? element.road: "",
              }
            );
            locations.push(l);
          }
          let features: string[] = [];
          let terms: string[] = [];
          for (const element of response.features) {
            if (element.featureType == 'Function') {
              features.push(element.featureName);
            } else {
              terms.push(element.featureName)
            }
          }
          this.idCar = response.id;
          this.carRateAvg = response.profileDto.rating;
          this.currentLocationId = locations[0].id ?? 0;
          let one: CarBasic = {
            id: response.id,
            front: response.carDetail.frontImgUrl,
            back: response.carDetail.backImgUrl,
            left: response.carDetail.leftImgUrl,
            right: response.carDetail.rightImgUrl,
            brand: response.brandModel.brand.name,
            model: response.brandModel.modelName,
            rating: response.rating,
            rides: response.noRides,
            price: response.carPricing.basePrice,
            transmission: response.transmission,
            seat: response.noSeat,
            mileage: response.carDetail.mileage,
            consumption: response.carDetail.fuelConsumption,
            description: response.carDetail.description,
            deposit: response.carPricing.requiredDeposit,
            fuel: response.fuel,
            location: locations,
            features: features,
            terms: terms,
            distance: 0,
            lat: 0,
            lng: 0,
            insurance_status: response.insuranceStatus,
          }
          this.car = one;
          this.getCarRelated(this.car.id, this.car.lat, this.car.lng);
          this.getCarRating(this.car.id, null, this.sizePage);
          this.user = new User();
          this.user.id = response.profileDto.ownerId;
          this.user.firstName = response.profileDto.firstName;
          this.user.lastName = response.profileDto.lastName;
          this.user.rating = response.profileDto.rating;
          this.user.avatar = response.profileDto.avatar;
          this.getUser().then(cu => {
            if (cu) {
              if (cu.id == this.user.id) this.disable = true;
            }
          }).catch(error => {
            console.error("Failed to get user:", error);
          });
          this.filtersLoaded = Promise.resolve(true);
          resolve();
        }, (error: any) => {
          console.error('ERROR_GET_CAR:', error);
          load = false;
          this.router.navigate(['/404'], { skipLocationChange: true });
          reject(error);
        },
        () => {
          if (!load) {
            this.router.navigate(['/404'], { skipLocationChange: true });
          } else {
            this.isLoading = false;
          }
        });
    });
  }

  currentLocationId: number = 0;
  @ViewChild('selectLoc') selectLoc!: ElementRef;
  redirectToBooking(carId: any) {
    let loc = this.getCodeLocation(this.currentLocationId) ?? '';
    window.open('booking/' + carId + '/' + this.dateRangeForm.value.startDate + ":00" + '/' + this.dateRangeForm.value.endDate + ":00" + '/' + loc.split(" ")[0] + '/' + loc.split(" ")[1] + '/' + loc.split(" ")[2] + '/' + this.getRoad(this.currentLocationId), "_self");
  }

  getCodeLocation(idL: number) {
    return this.car.location.find(l => l.id == idL)?.code;
  }

  getRoad(idL: any) {
    if (this.roads.find(l => l.id == idL))
      return this.roads.find(l => l.id == idL)?.value;
    else return '';
  }

  changeLoc() {
    this.currentLocationId = this.selectLoc.nativeElement.value;
  }
  getCarRelated(id: any, lat: any, lng: any) {
    let load = true;
    this.isLoadingRelated = true;
    this.carService.getCarRelate(id, lat, lng).subscribe((response: any) => {
      for (const element of response) {
        let locations: Location[] = [];
        let road = element.road != null ? element.road + ", " : "";
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
        this.relateCars.push(one);
      }
      this.filtersLoaded = Promise.resolve(true);
    }, error => {
      console.error(error);
      load = false;
    },
      () => {
        if (load) {
          this.isLoadingRelated = false;
        } else {
          console.error('Can not load related car');
        }
      });
  }

  getMoreComment() {
    this.curPage++;
    this.getCarRating(this.idCar, this.curPage, this.sizePage);
  }

  getCarRating(id: any, page: any, size: any) {
    let load = true;
    this.isLoading = true;
    this.carService.getCarRating(id, page, size).subscribe((response: any) => {
      this.totalRate = response.totalElements;
      this.curPage = response.pageable.pageNumber;
      if (this.sizePage * (this.curPage + 1) < this.totalRate) this.moreRate = true;
      else this.moreRate = false;
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
        this.rates.push(rate);
      }
    }, error => {
      load = false;
    },
      () => {
        if (!load) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        } else {
          this.isLoading = false;
        }
      });
  }

  convertMoney(number: number): string {
    // Chuyển số thành chuỗi và ngược lại để dễ xử lý
    let numString: string = String(number);

    // Mảng để lưu trữ các phần tử sau khi được chia nhỏ
    const parts: string[] = [];

    // Tách chuỗi thành các phần từ có độ dài là 3
    while (numString.length > 3) {
      parts.unshift(numString.slice(-3)); // Thêm phần tử vào đầu mảng
      numString = numString.slice(0, -3); // Loại bỏ 3 ký tự cuối
    }

    // Thêm phần tử cuối cùng vào mảng
    parts.unshift(numString);

    // Kết hợp các phần tử bằng dấu chấm
    return parts.join('.');
  }

  countMoney(price: number, deposit: number, day: number): number {
    return price * day + deposit;
  }

  showMore(element: any) {
    var $btn = element as HTMLElement;
    let previousElement = $btn.previousElementSibling;
    while (previousElement) {
      if (previousElement.classList.contains('hide')) {
        previousElement.classList.remove('hide');
        $btn.remove();
        break;
      }
      previousElement = previousElement.previousElementSibling;
    }
  }

  zoomImg(element: any) {
    this.modalImg.nativeElement.src = element.src;
    this.modalImg.nativeElement.alt = element.src;
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

  getTime(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`;
  }

  roundStars(stars: number): number {
    return Math.round(stars);
  }

  compareDates(dateTimeString1: string, dateTimeString2: string): number {
    // Parse date-time strings into Date objects
    const dateTime1 = new Date(dateTimeString1);
    const dateTime2 = new Date(dateTimeString2);

    // Convert both date times to milliseconds since Unix epoch
    const time1 = dateTime1.getTime();
    const time2 = dateTime2.getTime();

    // Compare the milliseconds values
    if (time1 < time2) {
      return -1;
    } else if (time1 > time2) {
      return 1;
    } else {
      return 0; // Dates are equal
    }
  }

  convertDateFormat(dateTimeString: string): string {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day}/${month}/${year}`;
  }

  countDays(startDate: string, endDate: string): string {
    if (startDate == null || endDate == null || "" == endDate || "" == startDate) return "…";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end.getTime() < start.getTime()) return "…";
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}`;
  }

  scrollToTarget(idTargetElement: any) {
    const targetElement = this.elementRef.nativeElement.querySelector('#' + idTargetElement);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (offset > 100) { // Adjust 100 to your desired scroll position
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
    this.applyStyles();
  }
  timeOptions: { value: number; label: string }[] = [];


  applyStyles() {
    const headerCar = document.querySelector('.header-car');
    if (headerCar) {
      if (this.isScrolled) {
        this.renderer.setStyle(headerCar, 'z-index', '100');
      } else {
        this.renderer.removeStyle(headerCar, 'z-index');
      }
    }
  }

}
