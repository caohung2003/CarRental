import { NgModule } from '@angular/core';
import { BookingComponent } from './booking/booking.component';
import { BookingInfoComponent } from './booking-info/booking-info.component';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import {
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { BookingFinishComponent } from './booking-finish/booking-finish.component';
import { StoreModule } from '@ngrx/store';
import {
  bookingInfoReducer,
} from './store/booking.reducers';
import { routes } from './store/booking.routes';
import { BreadcrumbComponent } from '../../../shared/bread-crumb/bread-crumb.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { BookingService } from '../../../services/booking.service';
import { AuthGuardService } from '../../authorization/auth.guard';
import { NgbDateCustomerParserFormatter } from '../../../services/NgbDateCustomParserFormatter.service';
import { initFlowbite } from 'flowbite';
import { CarInfoComponent } from './car-info/car-info.component';
import { CreateBookingUIComponent } from './create-booking-ui/create-booking-ui.component';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';

@NgModule({
  declarations: [
    BookingComponent,
    BookingInfoComponent,
    // BookingDetailComponent,
    // BookingProgressBarComponent,
    // BookingDetailFormModalComponent,
    BookingSummaryComponent,
    // BookingPaymentComponent,
    BookingFinishComponent,
    CarInfoComponent,
    CreateBookingUIComponent,
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    RouterModule.forChild(routes),
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    JsonPipe,
    ReactiveFormsModule,
    StoreModule.forFeature('bookingInfo', bookingInfoReducer),
    BreadcrumbComponent,
    NgbCarouselModule,
    CarouselComponent,
    DatePickerComponent
  ],
  providers: [
    BookingService,
    AuthGuardService,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateCustomerParserFormatter,
    },
    DatePipe
  ],
  bootstrap: [BookingComponent],
  exports: [HeaderComponent, FooterComponent, RouterOutlet],
})
export class BookingModule {
  // constructor(private readonly route:Router, private readonly activatedRoute:ActivatedRoute){
  //   this.route.navigate(['../info'], {relativeTo: this.activatedRoute});
  // }

  constructor(){
    initFlowbite();
  }
}
