import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { initFlowbite } from "flowbite";
import { CommonModule, NgIf } from "@angular/common";
import { BookingService } from "../../../services/booking.service";
import { Router, RouterModule } from "@angular/router";
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component";
import { CarInfo } from '../mybooking.component';
import { CarService } from '../../../services/car.service';
import { BookingResponseBasic } from '../../../models/interfaces/booking.response';
import { ILocationResp, LocationService } from '../../../services/location.service';
import { Observable, map, take } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ErrorsService } from '../../../services/errors.service';
import { RatingViewCarComponent } from '../../rating/rating-view-car/rating-view-car.component';
import { RatingCarComponent } from '../../rating/rating-car/rating-car.component';

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [CommonModule, CarouselComponent, RouterModule, RatingViewCarComponent, RatingCarComponent],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.css'
})
export class BookingItemComponent implements OnInit, AfterViewInit {

  @Input() public booking: BookingResponseBasic;
  @Input() public car: CarInfo;
  @Input() public index: number;
  public location: string = '';
  @Output() openRatingModal = new EventEmitter<void>();
  onButtonClick() {
    this.openRatingModal.emit();
  }

  ngOnInit(): void {
    initFlowbite();
  }
  constructor(
    private router: Router,
    private el: ElementRef,
    private locationService: LocationService,
    private userService: UserService,
    private errorService: ErrorsService,
  ) {
  }
  ngAfterViewInit(): void {
    if (this.booking.wardId)
      this.getLocation(this.booking.wardId).subscribe((locationString) => {
        // 'locationString' contains the full location string
        this.location = ((this.booking.road && this.booking.road != '') ? this.booking.road + ', ' : ' ') + locationString;
      });
    console.log('car: ', this.car);
  }

  @ViewChild('option') option!: ElementRef;
  isShow = false;
  showOption() {
    this.isShow = !this.isShow;
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.el.nativeElement.contains(target);
    if (!clickedInside) {
      this.isShow = false;
    }
  }

  convert(input: string): string {
    return input.replace(/_/g, ' ');
  }

  formatDate(datetime: string): string {
    const [datePart, timePart] = datetime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}, ${day.length < 2 ? "0" + day : day}/${month.length < 2 ? "0" + month : month}/${year}`;
  }

  getLocation(wardId: number): Observable<string> {
    return this.locationService.getLocationByWardId(wardId + '').pipe(
      take(1),
      map((value: ILocationResp) => {
        const wardName = value.wardName;
        const districtName = value.districtName;
        const cityName = value.cityName;

        return wardName + ((districtName !== '') ? (', ' + districtName) : '') + ((cityName !== '') ? (', ' + cityName) : '');
      })
    );
  }

  findAncestor(element: any, className: string) {
    while (element && !element.classList.contains(className)) {
      element = element.parentElement;
    }
    return element;
  }

  async cancelBooking(id: any, event: any) {
    try {
      const confirmed = await this.errorService.showModalConfirm();
      if (confirmed) {
        this.userService.cancelBooking(id).subscribe(
          (response: any) => {
            this.errorService.showSwalToastMessage('success', 'You have successfully CANCELLED your trip. If you have any questions or complaints, please contact the hotline: 0999.888.666', 'top-end', 5000);
            let ancestor = this.findAncestor(event.target, 'item-car');

            // Set display to 'none' if ancestor exists
            if (ancestor) {
              ancestor.style.display = 'none';
            }
          },
          error => {
            console.log(error);
            this.errorService.showSwalToastMessage('error', 'An error has occurred. Please try again or contact the hotline: 0999.888.666 if you have any questions.', 'top-end', 5000);
          });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors if any
    }

  }

  redirect(link: string) {
    this.router.navigate([link]);
  }

  public checkDateExpired(pickUpDateTime: string): boolean {
    if (new Date(new Date(pickUpDateTime).getTime() + 7 * 86400000).getTime() < new Date().getTime()) {
      return true;
    } else {
      return false;
    }
  }
}
