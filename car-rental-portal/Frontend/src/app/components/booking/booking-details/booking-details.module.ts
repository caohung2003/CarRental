import { NgModule } from '@angular/core';
import { ViewEditBookingDetailsComponent } from './view-edit-booking-details/view-edit-booking-details.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { bookingDetailsRoutes } from './store/booking-details.routes';
import { CommonModule, DatePipe } from '@angular/common';
// import { ViewBookingDetailsSelections } from './booking-details-selections/booking-details-selections.component';

import {
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ViewBookingDetailsInfoFormComponent } from './booking-details-info-form/booking-details-info-form.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { BookingService } from '../../../services/booking.service';
import { CarService } from '../../../services/car.service';
import { NgbDateCustomerParserFormatter } from '../../../services/NgbDateCustomParserFormatter.service';
import { ViewCarDetailsComponent } from './view-car-details/view-car-details.component';
import { BreadcrumbComponent } from '../../../shared/bread-crumb/bread-crumb.component';
import { initFlowbite } from 'flowbite';
import { BookingModule } from '../create-booking/booking.module';
import { BookingDetailsBasicComponent } from './booking-details-basic/booking-details-basic.component';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';

@NgModule({
  imports: [
    RouterModule.forChild(bookingDetailsRoutes),
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NgbDatepickerModule,
    FormsModule,
    NgbModule,
    BreadcrumbComponent,
    BookingModule,
    CarouselComponent,
    DatePickerComponent
  ],
  declarations: [
    ViewCarDetailsComponent,
    ViewEditBookingDetailsComponent,
    ViewBookingDetailsInfoFormComponent,
    BookingDetailsBasicComponent
  ],
  providers: [
    BookingService,
    CarService,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateCustomerParserFormatter,
    },
    DatePipe
  ],
  bootstrap: [ViewEditBookingDetailsComponent],
})
export class BookingDetailsModule {
  constructor(){
    initFlowbite();
  }
}
